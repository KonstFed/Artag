function drawNewMatrix(image,points,name)
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
    for (var d = 0; d<points.length;d++)
    {


        var y1 = Math.round(points[d][0])
        var x1 = Math.round(points[d][1])
        var y2 = Math.round(points[(d+1)%4][0])
        var x2 = Math.round(points[(d+1)%4][1])
        ctx.beginPath()
        ctx.moveTo(x1,y1)
        ctx.lineTo(x2,y2)
        ctx.strokeStyle = '#0000ff';
        ctx.stroke()
        var curi = 4*(y1*width+x1)
        imgData.data[curi] = 255
        imgData.data[curi+1] = 0
        imgData.data[curi+2] = 0
        imgData.data[curi+3] = 255

    }
  
  ctx.putImageData(imgData, 0, 0);
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
function ARTag(raw,height,width)
{

const defaultOptions = {
    lowThreshold: 40,
    highThreshold: 55,
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
 function cannyEdgeDetector(image, options,height1,width1) {
    // image.checkProcessable('Canny edge detector', {
    //     bitDepth: 8,
    //     channels: 1,
    //     components: 1
//    options = Object.assign({}, defaultOptions, options);
  
    const width = width1;
    const height = height1;
    const brightness = 255
    var gfilter3 = [[1/16,2/16,1/16],[2/16,4/16,2/16],[1/16,2/16,1/16]]
    var gfilter = [[1/273,4/273,7/273,4/273,1/273],[4/273,16/273,26/273,16/273,4/273],[7/273,26/273,41/273,26/273,7/273],[1/273,4/273,7/273,4/273,1/273],[4/273,16/273,26/273,16/273,4/273]]
    gf = convolution(convolution(image,gfilter,2),gfilter,2)
    gf = convolution(gf,gfilter,2)
  
    
    const gradientX = convolution(gf,Gx,1)
    const gradientY = convolution(gf, Gy,1);
  
  
    const G = hypotenuse(gradientX,gradientY);
  
    // const Image = image.constructor;
  
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
                !((dir === 0 && (G[i][j] < G[i][j - 1] || G[i][j] < G[i][j + 1]))
                    || (dir === 3 && (G[i][j] < G[i - 1][j + 1] || G[i][j] < G[i + 1][j - 1]))
                    || (dir === 2 && (G[i][j] < G[i - 1][j] || G[i][j] < G[i + 1][j]))
                    || (dir === 1 && (G[i][j] < G[i - 1][j - 1] || G[i][j] < G[i + 1][j + 1])))
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
  function findCorners(image)
  {
      const minLenRect = image.length*1.5;
      const minAmount = 100
      const maxAmount = image.length*2 + image[0].length
      var br = false;
      var img = []
    for (var i = 0; i< image.length; i++)
    {
        img.push([])
        for (var j = 0 ; j <image[0].length; j++)
        {
            img[i].push(image[i][j])
        }
    }
      var rawpoints = [];
      for (var i = 0 ; i < img.length; i++)
      {

          for (var j = 0; j < img[0].length; j++)
          {
              if (img[i][j] == 255)
              {
                  // var maxx = 0;
                  // var maxy = 0;
                  // var minx = img[0].length;
                  // var miny = img.length;
                  var stuck = []
                  var points = []
                  stuck.push([i,j])
                  img[i][j] = 0;
                  while(stuck.length>0)
                  {
                    var cur = stuck.shift();
                    points.push(cur)
                    // if (cur[1]>maxx)
                    // {
                    //     maxx = cur[1]
                    // }
                    // if (cur[0]>maxy)
                    // {
                    //     maxy = cur[0]
                    // }
                    // if (cur[1]<minx)
                    // {
                    //     minx = cur[1]
                    // }
                    // if (cur[0]<miny)
                    // {
                    //     miny = cur[0]
                    // }
                    for (var ic = -1; ic<=1; ic++)
                    {
                        for (var jc = -1; jc<=1; jc++ )
                        {
                            if (cur[0] + ic == -1 || cur[0] + ic == img.length || cur[1] + jc == 0 || cur[1] + jc == img[0].length)
                            {
                                continue
                            }
                            else
                            {
                                if (img[cur[0] + ic][cur[1]+jc] == 255)
                                {
                                    img[cur[0]+ic][cur[1]+jc] = 0;
                                    stuck.push([cur[0]+ic,cur[1]+jc])
                                    
                                } 
                            }


                        }
                    }
                  }
                  if (points.length>minAmount && points.length<maxAmount)
                  {
                      var sery = 0;
                      var serx = 0;
                      for (var ri = 0; ri<points.length; ri++)
                      {
                        serx = serx  + points[ri][1];
                        sery = sery + points[ri][0];
                      }
                      serx = serx / points.length;
                      sery = sery / points.length;
                      points.sort(function(a,b)
                      {
                        return distPoints(b,[sery,serx]) - distPoints(a,[sery,serx])
                      })
                      rawpoints.push([points,[sery,serx]])
                  }
              }
          }
      }
      drawNew(image,rawpoints[0][0].slice(0,100),"kostya.png")
      var rects = []

      for (var i = 0; i < rawpoints.length; i++)
      {
        var tmp = [[],[],[],[]];

        var sy = rawpoints[i][1][0];
        var sx = rawpoints[i][1][1];
        var isOk = false;
        var nullch = true;
        var onech = true;
        var twoch = true;
        var threch = true;
        for (var j = 0; j < rawpoints[i][0].length; j++)
        {
          if (!nullch && !onech && !twoch && !threch)
          {
            isOk = true;
            break;
          }
          if (nullch && rawpoints[i][0][j][0] > sy && rawpoints[i][0][j][1] > sx)
          {
            tmp[1] = rawpoints[i][0][j]
            nullch = false;
          }
          else if (onech && rawpoints[i][0][j][0] > sy && rawpoints[i][0][j][1] < sx )
          {
            tmp[0] = rawpoints[i][0][j]
            onech = false;
          }
          else if (twoch && rawpoints[i][0][j][0] < sy && rawpoints[i][0][j][1] < sx)
          {
            tmp[3] = rawpoints[i][0][j]
            twoch = false;
          }
          else if (threch && rawpoints[i][0][j][0] < sy && rawpoints[i][0][j][1] > sx)
          {
            tmp[2] = rawpoints[i][0][j]
            threch = false;
          }
        }
        if (isOk && lenSquare(tmp[0],tmp[1],tmp[2],tmp[3])>minLenRect) 
        {
          rects.push(tmp)
        }
      }
      // drawNewMatrix(image,rects[1],"res\\night.png")
      return rects
      
  }
  function lenSquare(p1,p2,p3,p4)
  {
    var d12 = Math.sqrt(Math.pow(p1[0]-p2[0],2) + Math.pow(p1[1]-p2[1],2))
    var d14 = Math.sqrt(Math.pow(p1[0]-p4[0],2) + Math.pow(p1[1]-p4[1],2))
    var d23 = Math.sqrt(Math.pow(p3[0]-p2[0],2) + Math.pow(p3[1]-p2[1],2))
    var d34 = Math.sqrt(Math.pow(p3[0]-p4[0],2) + Math.pow(p3[1]-p4[1],2))
    return (d12 + d14 + d23 + d34)

  }
  function distPoints(p1,p2)
  {
    var sa = Math.sqrt(Math.pow(Math.abs(p1[0] - p2[0]),2) + Math.pow(p1[1]-p2[1],2) )
    return sa;
  }
  function loaddata(data,height,width)
  {
      var cnt = 0;
      var firstImage = []
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
            
              firstImage[i][j] = data[cnt]
              if (isNaN(firstImage[i][j]))
              {
                console.log("police")
              }
              cnt++;
          }
      }
      return firstImage;
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
  function decode(matr)
  {
    var rigt = []
    var pass = [0,1,3,7,15,31]
    for (var i = 0; i < matr.length; i++)
    {
        for (var j = 0 ; j < matr[0].length; j++)
        {
            if ((i == 0 && j == 0) || (i == 0 && j == matr[0].length-1)
            || (i == matr.length-1 && j == 0) || (i == matr.length-1 && j == matr[0].length-1))
            {
                continue;
            }
            rigt.push(matr[i][j]);
        }
    }
    var sd = []
    for (var j = 0; j < rigt.length; j++)
    {
        var dert = true;
        for (var dm = 0; dm<pass.length; dm++)
        {
            if(j == pass[dm])
            {
                dert = false;
                break;
            }
        }
        if (dert)
        {
            sd.push(rigt[j])
        }
    }
    var comands = []
    for (var sr = 0; sr<26  ; sr+=2)
    {
        var zn = sd[sr]*2 + sd[sr+1]
        switch(zn)
        {

            case 1:
                comands.push("L");
                break;
            case 2:
                comands.push("R");
                break;
            case 3:
                comands.push("F");
                break
        }
    }
    return(comands)
  }
  function funParam(p1,p2)
  {
      var k,b;
      if (p1[1] == p2[2])
      {
          k = image.length
      }
      else
      {
          k = (p1[0] - p2[0])/(p1[1]-p2[1])
      }
      b = p1[0]+p2[0] - k*(p1[1]+p2[1])
      b = b/2
      return [k,b]
  }
  function minP(p1,p2)
  {
    if (p1[1]>p2[1])
    {
      return p2;
    }
    else
    {
      return p1;
    }
  }
  function allPoints(p1,p2,image)
  {
    var p = []
    var x1 = Math.min(p1.x,p2.x);
    var y1 = Math.min(p1.y,p2.y);
    var x2 = Math.max(p1.x,p2.x);
    var y2 = Math.max(p1.y,p2.y);
    var deltaX = Math.abs(x2 - x1);
    var deltaY = Math.abs(y2 - y1);
    var signX = x1 < x2 ? 1 : -1;
    var signY = y1 < y2 ? 1 : -1;
    //
    var error = deltaX - deltaY;
    //
    // plot(x2, y2);
    while(x1 != x2 || y1 != y2) 
    {
        
      var error2 = error * 2;
      //
      if(error2 > -deltaY) 
      {
          error -= deltaY;
          x1 += signX;
      }
      if(error2 < deltaX) 
      {
          error += deltaX;
          y1 += signY;
      }
      p.push([y1,x1])
    }
    return p

  }
  function isBlackCage(p1,p2,p3,p4,image)
  {
    var black_bias = 100;
    var l1 = allPoints(p1,p2,image);
    var l2 = allPoints(p2,p3,image);
    var l3 = allPoints(p3,p4,image);
    var l4 = allPoints(p4,p1,image);
    var alp = l1.concat(l2,l3,l4);

    // alp.push([p1.y,p1.x],[p2.y,p2.x],[p3.y,p3.x],[p4.y,p4.x])
    alp.sort(function(a,b)
    {
      if (a[0] == b[0])
      {
        return a[1] - b[1];
      }
      else
      {
        return a[0] - b[0];
      }
    })
    var dalp = []
    var cnt = 0;
    for (var i = 0; i <alp.length;i++)
    {
      // dalp.push([alp[i][0]])
      dalp.push([])
      var ci = i;
      while (i != alp.length && alp[i][0] == alp[ci][0])
      {
        dalp[cnt].push(alp[i][1]);
        i++;
        
      }
      dalp[cnt].sort(function(a,b)
      {
        return a-b
      })
      dalp[cnt].unshift(alp[ci][0])
      i = i -1
      cnt++
    }
    var zn = 0
    var vs = 0;
    for (var i = 0; i < dalp.length; i++)
    {
      if (dalp[i].length == 2)
      {
        if (image[dalp[i][0]][dalp[i][1]] < black_bias)
        {
          zn++;
        
        }  
        // zn+= image[dalp[i][0]][dalp[i][1]]
        vs++;
      }
      else
      {
        for (var j = dalp[i][1]; j <= dalp[i][dalp[i].length-1]; j++)
        {
          vs++;
          if (image[dalp[i][0]][j] < black_bias)
          {
            zn++;
          }
          // zn+= image[dalp[i][0]][j]
        }
      }
    }
    var sreds = zn/vs
    return sreds>0.5
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
  function countArtag(points,image,LenSide)
  {
    var arpoints = []
    var upLine = funParam(points[0],points[1])
    var downLine = funParam(points[3],points[2])
    var distupline = Math.abs(points[0][1]-points[1][1])/LenSide;
    var distdownline = Math.abs(points[3][1]-points[2][1])/LenSide;
    // upline = funParam(points[0],points[1]);
    var minp1 = minP(points[0],points[1])
    var minp2 = minP(points[3],points[2])
    var cnt = 0;
    for (var i = 1; i < LenSide; i++)
    {
  
      var x1 = minp2[1]+ i*distdownline;
      var x2 = minp1[1] + i*distupline;
      var y1 = downLine[0] * x1 + downLine[1];
      var y2 = upLine[0] * x2 + upLine[1];
      var localDif = (y2 - y1)/LenSide;
      var local = funParam([x1,y1],[x2,y2]);
      arpoints.push([])
  
      // arpoints[cnt].push([y1,x1])
      for (var j = 1; j < LenSide; j++)
      {
        var y11 = Math.round(y1 + j*localDif);
        var x11 = Math.round(local[0]*y11 + local[1]);
        arpoints[cnt].push([y11,x11])
      }
      arpoints[cnt].sort(function (a,b) {
        return a[0] - b[0]
      })
      // arpoints[cnt].push([y2,x2])
      cnt++;
    
    }
    arpoints.sort(function(a,b)
    {
      return a[0][1] - b[0][1]
    })
    // drawNewMatrix1(image,arpoints,"res\\points.jpg")
    var matrix = []
    for (var i = 0; i < arpoints.length-1;i++)
    {
      matrix.push([])
      for (var j = 0; j < arpoints[i].length-1; j++)
      {
        var p1 = {x:arpoints[i][j][1],y:arpoints[i][j][0]}
        var p2 = {x:arpoints[i][j+1][1],y:arpoints[i][j+1][0]}
        var p3 = {x:arpoints[i+1][j+1][1],y:arpoints[i+1][j+1][0]}
        var p4 = {x:arpoints[i+1][j][1],y:arpoints[i+1][j][0]}
        // countColor(p1,p2,p3,p4,image);
        if (isBlackCage(p1,p2,p3,p4,image))
        {
          matrix[i].push(1);
        }
        else
        {
          matrix[i].push(0);
        }
      }
    }
    var copy = []
    for (var nice = 0; nice < matrix.length; nice++)
    {
      copy.push([])
      for (var jice = matrix[0].length-1; jice >= 0; jice--)
      {
        copy[nice].push(matrix[nice][jice])
      }
    }
    fl = true;
    for (var i = 0; i < 3; i++)
    {
      if (copy[LenSide-3][LenSide-3] == 0)
      {
        fl = false;
        break
      }
      else
      {
        copy = rotateMatrix(copy)
      }
    }


    return copy;
  }
    // var data1 = raw.split(" ");
    firstImage = loaddata(raw,height,width);
    imgf = cannyEdgeDetector(firstImage,defaultOptions,height,width);
    var rects = findCorners(imgf)
    if (rects.length>0)
    {
      
      var matr = countArtag(rects[0],firstImage,8)
      // console.log(matr)
      drawNewMatrix(imgf,rects[0],"res\\res.jpg")
      return decode(matr)
      
    }
}
fs = require("fs")
var da = fs.readFileSync("C:\\Projects\\Artag\\res\\input.txt","utf8").trim().split(", ")
console.log(ARTag(da,120,160))