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
  
  

  
  // function noiseReduction(image,k)
  // {
  //   var width = image[0].length;
  //   var height = image.length;
  //   let nearr = [];
  //   for (var i = 0;i<height;i++)
  //   {
  //       nearr.push([]);
  //       for (var j = 0;j<width;j++)
  //       {
  //           nearr[i].push(image[i][j]);
  //       }
  //   }
  //   for (var  i = k; i < height-k;i++)
  //   {
  //       for(var j = k;j<width-k;j++)
  //       {
  //           var sums = image[i-2][j-2] + image[i-2][j-1]*4 + image[i-2][j]*7 + image[i-2][j+1] * 4 + image[i-2][j+2] + image[i-1][j-2]*4 + image[i-1][j-1]*16 + image[i-1][j]*26 + image[i-1][j+1] * 16 + image[i-1][j+2] * 4;
  //           sums = sums+ image[i+2][j-2] + image[i+2][j-1]*4 + image[i+2][j]*7 + image[i+2][j+1] * 4 + image[i+2][j+2] + image[i+1][j-2]*4 + image[i+1][j-1]*16 + image[i+1][j]*26 + image[i+1][j+1] * 16 + image[i+1][j+2] * 4;
  //           sums = sums + 7*image[i][j-2] + 26*image[i][j-1] + 41*image[i][j] + 26*image[i][j+1] + 7*image[i][j+2]
  //           nearr[i][j] = sums/273
  //           // var sums = 0;x
        
  //       }
  
  //   }
  //   return nearr;
  // }
  
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
    gf = convolution(gf,gfilter)
  
    
    const gradientX = convolution(gf,Gx)
    const gradientY = convolution(gf, Gy);
   
  
    const G = hypotenuse(gradientX,gradientY);
    drawNew(G,[],"res\\g_x.jpg")
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
    drawNew(nms,[],"res\\kavo.png")
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
              // if (isNaN(firstImage[i][j]))
              // {
              //   console.log("police")
              // }
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
  function drawNewMatrix1(image,points,name)
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

        for (var e = 0; e<points[d].length; e++)
        {
          var y1 = Math.round(points[d][e][0])
          var x1 = Math.round(points[d][e][1])

          var curi = 4*(y1*width+x1)
          imgData.data[curi] = 255
          imgData.data[curi+1] = 0
          imgData.data[curi+2] = 0
          imgData.data[curi+3] = 255
        }
  
      }
    
    ctx.putImageData(imgData, 0, 0);
      canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, name)))
      return 0
  }
  
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
  
  function grayscale(rgb) {
    m = rgb.trim();
    return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
  }
  // function isBlackCage(p1,p2,p3,p4,img)
  // {
  //     black_bias = 50;
  //     cnt = 0;
  //     cntall = 0;

  //     // for (var i = Math.round(p1.y); i<=Math.round(p2.y); i++)
  //     // {
  //     //     for (j = Math.round(p1.x); j<Math.round(p2.x); j++)
  //     //     {
  //     //         if (img[i][j]<black_bias)
  //     //         {
  //     //             cnt++;
  //     //         }
  //     //         cntall++;
  //     //     }
  //     // }
  //     if ((cnt/cntall)>0.6) return true;
  //     else return false;
  // }
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
    return sreds>0.4
    console.log("fl")
  }
  function dist_to_line(x1,y1,x2,y2,x3,y3)
  {
      osn = Math.sqrt((x3-x2)*(x3-x2) + (y3-y2)*(y3-y2))
      return Math.abs(((x3-x2)*(y1 - y2)- (y3-y2)*(x1-x2))/osn)
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
    drawNewMatrix1(image,arpoints,"res\\points.jpg")
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
          matrix[i].push(0);
        }
        else
        {
          matrix[i].push(1);
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
      if (copy[LenSide-3][LenSide-3] == 1)
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
  function distPoints(p1,p2)
  {
    var sa = Math.sqrt(Math.pow(Math.abs(p1[0] - p2[0]),2) + Math.pow(p1[1]-p2[1],2) )
    return sa;
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

  // It's test
//   rigt = [1, 0, 0, 1, 1,0, 0,0,0,1,1,0,0,0,1,0,1,1,1,0,1]
//   pass = [0, 1, 3, 7, 15]
  // 

  new_contr = []
  new_rigt = rigt.slice()

  for (var i = 0; i < pass.length; i++)
  {
      new_rigt[pass[i]] = 0
  }

  for (var i = 0; i < pass.length; i++)
  {
      var ind = pass[i]
      var sum = 0
      for (var j = ind; j < new_rigt.length; j += 2 * (ind + 1))
      {
          for (var k = j; k < j + ind + 1; k++)
          {
              if (k == new_rigt.length)
              {
                  break
              }
              sum += new_rigt[k]
          }
      }
      if (sum % 2 == 0)
      {
          new_contr.push(0)
      }
      else
      {
          new_contr.push(1)
      }
  }


  var predatel = 0;
  for (var i = 0; i < pass.length; i++)
  {
      if (rigt[pass[i]] != new_contr[i])
      {
          predatel += pass[i] + 1
      }
  }

  if (rigt[predatel - 1] == 0)
    {rigt[predatel - 1] = 1}
  else 
  {
    rigt[predatel - 1] = 0}

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
    }//[
  var comands = []
  for (var sr = 0; sr<13  ; sr++)
  {
    var zn = sd[sr*2]*2 + sd[sr*2+1]
      comands.push(zn);
//        switch(zn)
//        {
//
//            case 1:
//                comands.push("L");
//                break;
//            case 2:
//                comands.push("R");
//                break;
//            case 3:
//                comands.push("F");
//                break
//        }
  }
  return(comands)
}
  // function douglas(points,eps)
  // {

  // // let pointType;

  //   const RDP = (l, eps) => {
  //     const last = l.length - 1;
  //     const p1 = l[0];
  //     const p2 = l[last];
  //     const x21 = p2.x - p1.x;
  //     const y21 = p2.y - p1.y;
    
  //     const [dMax, x] = l.slice(1, last)
  //         .map(p => Math.abs(y21 * p.x - x21 * p.y + p2.x * p1.y - p2.y * p1.x))
  //         .reduce((p, c, i) => {
  //           const v = Math.max(p[0], c);
  //           return [v, v === p[0] ? p[1] : i + 1];
  //         }, [-1, 0]);
    
  //     if (dMax > eps) {
  //       return [...RDP(l.slice(0, x + 1), eps), ...RDP(l.slice(x), eps).slice(1)];
  //     }
  //     return [l[0], l[last]]
  //   };
    
  //   // const points = [
  //   //   {x: 0, y: 0},
  //   //   {x: 1, y: 0.1},
  //   //   {x: 2, y: -0.1},
  //   //   {x: 3, y: 5},
  //   //   {x: 4, y: 6},
  //   //   {x: 5, y: 7},
  //   //   {x: 6, y: 8.1},
  //   //   {x: 7, y: 9},
  //   //   {x: 8, y: 9},
  //   //   {x: 9, y: 9}];
    
  //   console.log(RDP(points, 1));
  // }
  function findP(img,p,compare)
  {
    var an = []
    try{
    for (var ic = p[0]-1; ic<=p[0]+1; ic++)
    {
      for (var jc = p[1]-1; jc<=p[1]+1;jc++)
      {
        if (img[ic][jc] == 255)
        {
          img[ic][jc] = 60;
          an.push([ic,jc]);
        }
      }
    }
    an.sort(compare)
    if (an.length>0)
    {
      return [true,an[0]];
    }
    else
    {
      return [false]
    }
    }catch(e)
    {
      console.log("fdsf")
    }
  }
  function findPoints(img)
  {
    var compUp = function(a,b)
    {
      return b[0]-a[0];
    }
    var compLow = function(a,b)
    {
      return b[1]-a[1];
    }
    for (var i = 0; i <img.length; i++)
    {
      for (var j = 0; j < img[0].length;j++)
      {
        if (img[i][j] == 255)
        {
          var p = []
          var stuck = []
          stuck.push([i,j])
          img[i][j] = 60;
          while(stuck.length>0)
          {
            var cur = stuck.shift();
            p.push(cur);
            var zn = findP(img,cur,compLow);
            if (zn[0])
            {
              stuck.push(zn[1])
            }
            
          }
    
          p.sort(function(a,b)
          {
            if (a[1]==b[1])
            {
              return a[0]-b[0];
            }
            return a[1]-b[1];
          })
          console.log(p.length)
          var ger = []
          var upper = []
          var lower = []
          var cnt = 0;
          for (var i = 0; i<p.length;i++)
          {
            ger.push([])
            while(i<p.length-1 && p[i][1]==p[i+1][1])
            {
              ger[cnt].push(p[i])
              i++;
            }
            ger[cnt].push(p[i])
            cnt++;
          }
          for(var i = 0; i<ger.length;i++)
          {
            if (ger[i].length>4)
            {

            }
          }
          console.log(cnt)
          var f = true;
          break
        }
        
      }
      if (f)
      {
        break
      }
    }
  }
  var findCorners = require("./findCorners.js")
  var findRect = require("./findRect.js")
  // let data1 = raw.split(" ")
  firstImage = loaddata(raw,height,width)
  imgf = cannyEdgeDetector(firstImage,defaultOptions,height,width)
  drawNew(imgf,[],"res\\canny.jpg")
  // return -1
  var lines = findCorners.find(imgf)
  drawNewLines1(imgf,lines,"res\\lines.jpg")
  var rect = findRect.findRect(imgf,lines)
  if (rect.length>0)
  {

    var matr = countArtag(rect[0],firstImage,8)
    // console.log(matr)
    drawNewMatrix(imgf,rect[0],"res\\res.jpg")
    return decode(matr)
    
  }
  return -1
}
height = 120;
width = 160;
fs = require("fs")

// var picks = [9,8,9,9,5,5,8,10,12,8,10,11,8,7,5,6]
// for (var we = 0; we<16;we++)
// {
//   for(var hl = 1; hl<=picks[we];hl++)
//   {
//     var da = fs.readFileSync("src\\"+we+"_"+hl+".txt", "utf8").trim();
//     var znach = ARTag(da,height,width);
//     if (znach!=we)
//     {
//       console.log(znach)
//       console.log("help")
//       break
//       // drawNewMatrix(,arpoints,"res/matrix.jpg")
//     }
//   }
//   if (znach!=we)
//   {
//     break
//   }
// }
// console.log("f")
// drawNew()
var da = fs.readFileSync("C:\\Projects\\IRS2020\\day3\\task1_00.txt","utf8").split(" ")
// var znach = ARTag(da[1],height,width);
console.log("dsad")
var znach1 = ARTag(da,height,width);
console.log(znach1)
// console.log(znach)

