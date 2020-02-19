
const defaultOptions = {
  lowThreshold: 5,
  highThreshold: 40,
  // gaussianBlur: 1.1
};

const Gx = [
  [-1, 0, +1],
  [-2, 0, +2],
  [-1, 0, +1]
];

const Gy = [
  [-1, -2, -1],
  [0, 0, 0],
  [+1, +2, +1]
];

const convOptions = {
  bitDepth: 32,
  mode: 'periodic'
};

function findMaxValue(img)
{
  var ma = 0;
  for (var i = 0; i <img.length;i++)
  {
    for (var j = 0;j<img[0].length;j++)
    {
      if (img[i][j]>ma)
      {
        ma = img[i][j];
      }
    }
  }
  return ma
}

function noiseReduction(image,k)
{
  var width = image[0].length;
  var height = image.length;
  let nearr = [];
  for (var i = 0;i<height;i++)
  {
      nearr.push([]);
      for (var j = 0;j<width;j++)
      {
          nearr[i].push(image[i][j]);
      }
  }
  for (var  i = k; i < height-k;i++)
  {
      for(var j = k;j<width-k;j++)
      {
          var sums = image[i-2][j-2] + image[i-2][j-1]*4 + image[i-2][j]*7 + image[i-2][j+1] * 4 + image[i-2][j+2] + image[i-1][j-2]*4 + image[i-1][j-1]*16 + image[i-1][j]*26 + image[i-1][j+1] * 16 + image[i-1][j+2] * 4;
          sums = sums+ image[i+2][j-2] + image[i+2][j-1]*4 + image[i+2][j]*7 + image[i+2][j+1] * 4 + image[i+2][j+2] + image[i+1][j-2]*4 + image[i+1][j-1]*16 + image[i+1][j]*26 + image[i+1][j+1] * 16 + image[i+1][j+2] * 4;
          sums = sums + 7*image[i][j-2] + 26*image[i][j-1] + 41*image[i][j] + 26*image[i][j+1] + 7*image[i][j+2]
          nearr[i][j] = sums/273
          // var sums = 0;x
        
      }

  }
  return nearr;
}

function convolution(image,filter)
{
  
  let newConv = []
  var rad = Math.trunc(filter.length/2)
  for (var ds = 0; ds<image.length;ds++)
  {
    newConv.push([])
    for(var dj = 0; dj<image[0].length;dj++)
    {
      newConv[ds].push(0)
    }
  }

  for (var i = 0; i < image.length;i++)
  {
    for (var j = 0; j < image[0].length;j++)
    {
      if (i <= rad-1 || i >= image.length-rad || j <= rad-1 || j >= image[0].length-rad)
      {
        continue;
      }

      var zn=0;
      for (var c = -rad; c<=rad;c++)
      {
        for (var d = -rad; d<=rad;d++)
        {
          zn = zn + image[i+c][j+d] * filter[c+rad][d+rad]
        }
      }
      newConv[i][j] = zn;
    }
  }
  return newConv
}

function hypotenuse(img1,img2)
{
  let newimg = []
  for (var i = 0; i < img1.length;i++)
  {
    newimg.push([])
    for (var j = 0 ; j < img1[0].length;j++)
    {
      newimg[i].push(Math.sqrt( img1[i][j]*img1[i][j] + img2[i][j]*img2[i][j]))
    }
  }
  return newimg
}

function cannyEdgeDetector(image, options,height1,width1) {
  // image.checkProcessable('Canny edge detector', {
  //     bitDepth: 8,
  //     channels: 1,
  //     components: 1
  options = Object.assign({}, defaultOptions, options);

  const width = width1;
  const height = height1;
  const brightness = 255
  var gfilter3 = [[1/16,2/16,1/16],[2/16,4/16,2/16],[1/16,2/16,1/16]]
  var gfilter = [[1/273,4/273,7/273,4/273,1/273],[4/273,16/273,26/273,16/273,4/273],[7/273,26/273,41/273,26/273,7/273],[1/273,4/273,7/273,4/273,1/273],[4/273,16/273,26/273,16/273,4/273]]
  gf = convolution(convolution(image,gfilter),gfilter)
  // drawNew(gf,[],"src\\gaus.jpg")
  // drawNew(image,[],"src\\standart.jpg")
  const gradientX = convolution(gf,Gx)
  const gradientY = convolution(gf, Gy);


  const G = hypotenuse(gradientX,gradientY);

  const Image = image.constructor;

  nms = []
  edges = []
  finalImage = []
  for (var i = 0 ; i < height; i++)
  {
    nms.push([])
    edges.push([])
    finalImage.push([])

    for (var j = 0; j < width;j++)
    {
      nms[i].push(0)
      edges[i].push(0)
      finalImage[i].push(0)

    }
  }

  for (var i = 1; i < height - 1; i++) {
      for (var j = 1; j < width - 1; j++) {

          var dir = (Math.round(Math.atan2(gradientY[i][j], gradientX[i][j]) * (4.0 / Math.PI)) + 4) % 4;

          if (
              !((dir === 0 && (G[i][j] <= G[i][j - 1] || G[i][j] <= G[i][j + 1]))
                  || (dir === 3 && (G[i][j] <= G[i - 1][j + 1] || G[i][j] <= G[i + 1][j - 1]))
                  || (dir === 2 && (G[i][j] <= G[i - 1][j] || G[i][j] <= G[i + 1][j]))
                  || (dir === 1 && (G[i][j] <= G[i - 1][j - 1] || G[i][j] <= G[i + 1][j + 1])))
          ) {
              nms[i][j] =  G[i][j];
          }
      }
  }

  for (var i = 0; i <  height; i++) {
    for (var j = 0; j<width; j++)
    {
      var currentNms = nms[i][j];
      var currentEdge = 0;
      if (currentNms > options.highThreshold) {
          currentEdge++;
          finalImage[i][j] = brightness;
      }
      if (currentNms > options.lowThreshold) {
          currentEdge++;
      }

      edges[i][j] = currentEdge;
    }
  }

  // Hysteresis: first pass
  var currentPixels = [];
  for (i = 1; i < height - 1; ++i) {
      for (j = 1; j < width - 1; ++j) {
          if (edges[i][j] !== 1) {
              continue;
          }

          // outer: for (var k = i - 1; k < i + 2; ++k) {
          //     for (var l = j - 1; l < j + 2; ++l) {
          //         if (edges.getValueXY(k, l, 0) === 2) {
          //             currentPixels.push([i, j]);
          //             finalImage.setValueXY(i, j, 0, brightness);
          //             break outer;
          //         }
          //     }
          // }
          for (var k = i - 1; k < i + 2; k++) {
            for (var l = j - 1; l < j + 2; l++) {
                if (edges[k][l] === 2) {
                    currentPixels.push([i,j]);
                    finalImage[i][j] =  brightness;
                    // break outer;
                }
            }
          }
      }
  }

  // Hysteresis: second pass
  while (currentPixels.length > 0) {
      var newPixels = [];
      for (var i = 0; i < currentPixels.length; i++) {
          for (j = -1; j < 2; j++) {
              for (k = -1; k < 2; k++) {
                  if (j === 0 && k === 0) {
                      continue;
                  }
                  try{
                    var row = currentPixels[i][0] + j;
                    var col = currentPixels[i][1] + k;
                    if (edges[row][col] === 1 && finalImage[row][col] === 0) {
                        newPixels.push([row, col]);
                        finalImage[row][col] = brightness;
                    }
                  }
                  catch(e)
                  {
                    console.log("hlep")
                  }
              }
          }
      }
      currentPixels = newPixels;
  }

  return finalImage;
}
function loaddata(data,height,width)
{
    var cnt = 0;
    let firstImage = []
    for( var i = 0; i < height;i++)
    {
        firstImage.push([])
        for (var j = 0;j <width;j++)
        {

            firstImage[i].push("")

        }
    }
    if (height*width != data.length)
    {
      console.log("help")
    }
    for( var i = 0; i < height;i++)
    {

        for (var j = 0;j <width;j++)
        {
            
            firstImage[i][j] = grayscale(data[cnt])
            if (isNaN(firstImage[i][j]))
            {
              console.log("police")
            }
            cnt++;
        }
    }
    return firstImage;
}
function drawNewAlive(image,lines,name)
{
    var path = require('path')

    Canvas = require("Canvas")
    var height = image.length
    var width = image[0].length
    var canvas = Canvas.createCanvas(width,height)
    var ctx = canvas.getContext('2d')

    var imgData = ctx.createImageData(width, height);
    var i,x=0,y=0,cnt = 0;
    for (var y = 0;y<height;y++)
    {
        for (var x = 0;x<width;x++)
        {
        
          var tmpznach = Math.abs(image[y][x])

            imgData.data[cnt] = tmpznach
            imgData.data[cnt+1] = tmpznach
            imgData.data[cnt+2] = tmpznach
            imgData.data[cnt+3] = 255
            cnt = cnt+4

        }
    }
    ctx.putImageData(imgData, 0, 0);
    var cns = 0;
    for (var c = 0; c<lines.length;c++)
    {

        for (var d = 0; d<4;d++)
        {
        
        ctx.beginPath();
        ctx.moveTo(Math.round(lines[c][d][1]), Math.round(lines[c][d][0]));
        ctx.lineTo(Math.round(lines[c][(d+1)%4][1]), Math.round(lines[c][(d+1)%4][0]));
          if (cns == 0)
          {
            ctx.strokeStyle = '#ff0000';
          }
          else if (cns == 1)
          {
            ctx.strokeStyle = '#00ff00';
          }
          else if (cns == 2)
          {
            ctx.strokeStyle = '#0000ff';
          }        
          else if (cns == 3)
          {
            ctx.strokeStyle = '#30d5c8';
          }
          else if (cns == 4)
          {
            ctx.strokeStyle = "ffffff";
          }
          else if (cns == 5)
          {
            ctx.strokeStyle = "ffff00";
          }
          else if (cns == 6)
          {
            ctx.strokeStyle = "ff00ff";
          }
          else if (cns == 7)
          {
            ctx.strokeStyle = "00ffff";
          }
        
        ctx.stroke();
        }

        cns = (cns + 1)%8

    }

    canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, name)))
    return 0
}
function drawNew(image,corners,name)
{
    var path = require('path')

    Canvas = require("Canvas")
    var height = image.length
    var width = image[0].length
    var canvas = Canvas.createCanvas(width,height)
    var ctx = canvas.getContext('2d')

    var imgData = ctx.createImageData(width, height);
    var i,x=0,y=0,cnt = 0;
    for (var y = 0;y<height;y++)
    {
        for (var x = 0;x<width;x++)
        {
          var tmpznach = Math.abs(image[y][x])
            if (tmpznach == 120)
            {
              imgData.data[cnt] = 255
              imgData.data[cnt+1] = 255
              imgData.data[cnt+2] = 0
              imgData.data[cnt+3] = 255
              cnt = cnt+4
            }
            else
            {
              imgData.data[cnt] = tmpznach
              imgData.data[cnt+1] = tmpznach
              imgData.data[cnt+2] = tmpznach
              imgData.data[cnt+3] = 255
              cnt = cnt+4
            }

        }
    }
    for (var c = 0; c<corners.length;c++)
    {
        var y1 = corners[c][0]
        var x1 = corners[c][1]
        var curi = 4*(y1*width+x1)
        imgData.data[curi] = 255
        imgData.data[curi+1] = 0
        imgData.data[curi+2] = 0

    }
    ctx.putImageData(imgData, 0, 0);
    canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, name)))
    return 0
}
function drawNewLines1(image,points,name)
{
    var path = require('path')

    Canvas = require("Canvas")
    var height = image.length
    var width = image[0].length
    var canvas = Canvas.createCanvas(width,height)
    var ctx = canvas.getContext('2d')

    var imgData = ctx.createImageData(width, height);
    var i,x=0,y=0,cnt = 0;
    for (var y = 0;y<height;y++)
    {
        for (var x = 0;x<width;x++)
        {
        
          var tmpznach = Math.abs(image[y][x])
          // if (tmpznach == 120)
          // {
          //   imgData.data[cnt] = 255
          //   imgData.data[cnt+1] = 0
          //   imgData.data[cnt+2] = 255
          //   imgData.data[cnt+3] = 255
          //   cnt = cnt+4
          // }
          // else
          // {
            imgData.data[cnt] = tmpznach
            imgData.data[cnt+1] = tmpznach
            imgData.data[cnt+2] = tmpznach
            imgData.data[cnt+3] = 255
            cnt = cnt+4
          // }
        }
    }
    ctx.putImageData(imgData, 0, 0);
    var cns = 0;
    for (var c = 0; c<points.length;c++)
    {
        
        // var y1 = corners[c][0]
        // var x1 = corners[c][1]
        // var curi = 4*(y1*width+x1)
 
          ctx.beginPath();
          ctx.moveTo(points[c][0][1], points[c][0][0]);
          ctx.lineTo(points[c][1][1], points[c][1][0]);
          if (cns == 0)
          {
            ctx.strokeStyle = '#ff0000';
          }
          else if (cns == 1)
          {
            ctx.strokeStyle = '#00ff00';
          }
          else if (cns == 2)
          {
            ctx.strokeStyle = '#0000ff';
          }        
          else if (cns == 3)
          {
            ctx.strokeStyle = '#30d5c8';
          }
          else if (cns == 4)
          {
            ctx.strokeStyle = "ffffff";
          }
          else if (cns == 5)
          {
            ctx.strokeStyle = "ffff00";
          }
          else if (cns == 6)
          {
            ctx.strokeStyle = "ff00ff";
          }
          else if (cns == 7)
          {
            ctx.strokeStyle = "00ffff";
          }
          
          ctx.stroke();
        
          cns = (cns + 1)%8

    }

    canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, name)))
    return 0
}
function drawNewLines(image,points,name)
{
    var path = require('path')

    Canvas = require("Canvas")
    var height = image.length
    var width = image[0].length
    var canvas = Canvas.createCanvas(width,height)
    var ctx = canvas.getContext('2d')

    var imgData = ctx.createImageData(width, height);
    var i,x=0,y=0,cnt = 0;
    for (var y = 0;y<height;y++)
    {
        for (var x = 0;x<width;x++)
        {
        
          var tmpznach = Math.abs(image[y][x])
          // if (tmpznach == 120)
          // {
          //   imgData.data[cnt] = 255
          //   imgData.data[cnt+1] = 0
          //   imgData.data[cnt+2] = 255
          //   imgData.data[cnt+3] = 255
          //   cnt = cnt+4
          // }
          // else
          // {
            imgData.data[cnt] = tmpznach
            imgData.data[cnt+1] = tmpznach
            imgData.data[cnt+2] = tmpznach
            imgData.data[cnt+3] = 255
            cnt = cnt+4
          // }
        }
    }
    ctx.putImageData(imgData, 0, 0);
    var cns = 0;
    for (var c = 0; c<points.length;c++)
    {
        
        // var y1 = corners[c][0]
        // var x1 = corners[c][1]
        // var curi = 4*(y1*width+x1)
        for (var jon = 0; jon<points[c].length;jon++)
        {
          ctx.beginPath();
          ctx.moveTo(points[c][jon][0][1], points[c][jon][0][0]);
          ctx.lineTo(points[c][jon][1][1], points[c][jon][1][0]);
          if (cns == 0)
          {
            ctx.strokeStyle = '#ff0000';
          }
          else if (cns == 1)
          {
            ctx.strokeStyle = '#00ff00';
          }
          else if (cns == 2)
          {
            ctx.strokeStyle = '#0000ff';
          }        
          else if (cns == 3)
          {
            ctx.strokeStyle = '#30d5c8';
          }
          else if (cns == 4)
          {
            ctx.strokeStyle = "ffffff";
          }
          else if (cns == 5)
          {
            ctx.strokeStyle = "ffff00";
          }
          else if (cns == 6)
          {
            ctx.strokeStyle = "ff00ff";
          }
          else if (cns == 7)
          {
            ctx.strokeStyle = "00ffff";
          }
          
          ctx.stroke();
        }
        // break
        cns = (cns + 1)%8
        // imgData.data[curi] = 255
        // imgData.data[curi+1] = 0
        // imgData.data[curi+2] = 0

    }

    canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, name)))
    return 0
}

function grayscale(rgb) {
  m = rgb.trim();
  return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
}

function artag_matrix(points,img,bias = 6)
{
  function isBlackCage(p1,p2,img)
  {
      black_bias = 60;
      cnt = 0;
      cntall = 0;
  
      for (var i = Math.round(p1.y); i<=Math.round(p2.y); i++)
      {
          for (j = Math.round(p1.x); j<Math.round(p2.x); j++)
          {
              if (img[i][j]<black_bias)
              {
                  cnt++;
              }
              cntall++;
          }
      }
      if ((cnt/cntall)>0.6) return true; 
      else return false;
  }
    function rotateMatrix(matrix)
    {
        m1 = [];
        for (var i = 0; i<matrix.length;i++)
        {
            m1.push([]);
            for (var j = 0;j<matrix.length;j++)
            {
                m1[i].push(0)
            }
        }
        for (var i = 0; i<matrix.length;i++)
        {
            for (var j = 0;j<matrix.length;j++)
            {
                m1[i][matrix.length-1 - j] = matrix[j][i]
            }
        }
        return (m1);
    }
    function sortPo(a,b)
    {
        return a[0] - b[0];
    }
    po = [[points.p1.x+points.p1.y,0],[points.p2.x+points.p2.y,1],[points.p3.x+points.p3.y,2],[points.p4.x+points.p4.y,3]]
    pointse = [points.p1,points.p2,points.p3,points.p4]

    po.sort(sortPo);
    difx = Math.abs(pointse[po[0][1]].x - pointse[po[3][1]].x)/bias;
    dify = Math.abs(pointse[po[0][1]].y - pointse[po[0][1]].x)/bias;
    matrix = []
    r = 0;
    p1x = Math.min(pointse[0].x,pointse[1].x,pointse[2].y,pointse[3].y)
    p3x = Math.max(pointse[0].x,pointse[1].x,pointse[2].y,pointse[3].y);
    p1y = Math.min(pointse[2].y,pointse[3].y,pointse[0].y,pointse[1].y);
    p3y = Math.max(pointse[2].y,pointse[3].y,pointse[0].x,pointse[1].x);
    difx = Math.abs(p1x - p3x) / bias;
    dify = Math.abs(p1y - p3y) / bias;

    for (var row = dify+p1y;row<=p3y-dify-4;row += dify)
    {
        matrix.push([])
        for (var col = difx + p1y; col <= p3y- difx-4; col += difx)
        {
            if (isBlackCage({x:col-difx,y:row-dify},{x:col,y:row},img))
            {
                matrix[r].push(1);
            }
            else{
                matrix[r].push(0);
            }
        }
        r++;
    }
    flags = false
    for (c = 0; c<4;c++)
    {
        if (matrix[bias-3][bias-3]==0){
            flags = true
            break;
        }
        else{
            matrix = rotateMatrix(matrix);
        }
    }
    if (flags)
    {
        answ = [];
        for (var j = 0;j<matrix.length;j++)
        {
            for (var i = 0; i<matrix.length;i++)
            {
                if ((j == 0 && i == 0) || (j == 0 && i == matrix.length-1) ||(j == matrix.length-1 && i == 0) || (j == matrix.length-1 && i == matrix.length-1))
                {
                    continue;
                }
                else{
                    answ.push(matrix[j][i]);
                }
            }
        }
        var n = answ[2]+""+answ[4];
        var x = answ[5] + "" + answ[6] + "" + answ[8];
        var y = answ[9] + "" + answ[10] + "" + answ[11];

    
        return {n:parseInt(n,2),x:parseInt(x,2),y:parseInt(y,2)};
    }
    else
    {
        return {n:-1,x:-1,y:-1};
    }

}
function countArtag(points,image,LenSide)
{
  
}
console.log("s")
height = 960;
width = 1280;
DataPath = "test_in_text1.txt"
fs = require("fs")
var findCorners = require("./findCorners.js")
var findRect = require("./findRect.js")
let data = fs.readFileSync(DataPath, "utf8").trim();

let data1 = data.split(",")
firstImage = loaddata(data1,height,width)
imgf = cannyEdgeDetector(firstImage,defaultOptions,height,width)

var lines = findCorners.find(imgf)
drawNewLines1(imgf,lines,"res\\lines.png")
var rect = findRect.findRect(imgf,lines)
drawNewAlive(imgf,rect,"res\\results.png")
// console.log(artag_matrix(rect[0],firstImage))
var psae = {p1:{x:rect[0][0][1],y:rect[0][0][0]},p2:{x:rect[0][1][1],y:rect[0][1][0]},p3:{x:rect[0][2][1],y:rect[0][2][0]},p4:{x:rect[0][3][1],y:rect[0][3][0]}}
console.log(artag_matrix(psae,firstImage))
console.log("f")