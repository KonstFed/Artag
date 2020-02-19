
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
var findRect = function(image,lines)
{
    const minDist = image.length/20
    const minLenRect = image.length/2
    const porogDist = 10;
    const angleDif = 0.2
    function lenSquare(p1,p2,p3,p4)
    {
      var d12 = Math.sqrt(Math.pow(p1[0]-p2[0],2) + Math.pow(p1[1]-p2[1],2))
      var d14 = Math.sqrt(Math.pow(p1[0]-p4[0],2) + Math.pow(p1[1]-p4[1],2))
      var d23 = Math.sqrt(Math.pow(p3[0]-p2[0],2) + Math.pow(p3[1]-p2[1],2))
      var d34 = Math.sqrt(Math.pow(p3[0]-p4[0],2) + Math.pow(p3[1]-p4[1],2))
      return (d12 + d14 + d23 + d34)

    }
    function uniteLines(line1,line2)
    {
      var coords = [line1[0],line1[1],line2[0],line2[1]]

      coords.sort(compareLines)
      var x1 = coords[0][1]
      var y1 = coords[0][0]
      var x2 = coords[3][1]
      var y2 = coords[3][0]
      var k;
      if (x1 == x2)
      {
        k = image.length
      }
      else
      {
        k = (y1-y2)/(x1-x2)
      }
      b = y1 - k*x1
      var angle = Math.atan(k)
      return [[y1,x1],[y2,x2],angle,[k,b]]
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
    function isIntersect(line1,line2)
    {
      var x = (line2[3][1] - line1[3][1])/(line1[3][0] - line2[3][0]);
      var y = line1[3][0]*x + line1[3][1];
      if (y<image.length && x < image[0].length && x>=0 && y >= 0)
      {
        if ((distPoints(line1[0],[y,x])<minDist || distPoints(line1[1],[y,x])) && (distPoints(line2[0],[y,x])<minDist || distPoints(line2[1],[y,x])))
        {
          return [y,x,true]
        }
      }
      return [NaN,NaN,false]
      
    }
    function sortLinesByAnge(a,b)
    {
      return a[2] - b[2]
    }
    function contains(ar,index)
    {
        for (var i = 0; i <ar.length; i++)
        {
            if (ar[i][0] == index[0] && ar[i][1] == index[1])
            {
                return true
            }
        }
        return false
    }
    function distPoints(p1,p2)
    {
      var sa = Math.sqrt(Math.pow(Math.abs(p1[0] - p2[0]),2) + Math.pow(p1[1]-p2[1],2) )
      return sa;
    }
    function dist_to_line(x1,y1,x2,y2,x3,y3)
    {
        osn = Math.sqrt((x3-x2)*(x3-x2) + (y3-y2)*(y3-y2))
        return Math.abs(((x3-x2)*(y1 - y2)- (y3-y2)*(x1-x2))/osn)
    }
    function compareLines(a,b)
    {
      return b[1] - a[1]
    }
    function mediumPoint(p1,p2)
    {
      var x = (p1[1] + p2[1])/2
      var y = (p1[0]+p2[0])/2
      return [y,x]
    }
    function isRect(l1,l2,l3,l4)
    {
      function isConnect(lf,ls)
      {
        if (distPoints(lf[0],ls[0])<minDist)
        {
          return [true,mediumPoint(lf[0],ls[0])];
        }
        else if (distPoints(lf[1],ls[0])<minDist)
        {
          return [true,mediumPoint(lf[1],ls[0])]
        }
        else if (distPoints(lf[0],ls[1])<minDist)
        {
          return [true,mediumPoint(lf[0],ls[1])]
        }
        else if (distPoints(lf[1],ls[1])<minDist)
        {
          return [true,mediumPoint(lf[1],ls[1])]
        }
        return [false];
      }

      var l13 = isConnect(l1,l3);
      var l14 = isConnect(l1,l4);
      var l23 = isConnect(l2,l3);
      var l24 = isConnect(l2,l4)
      
      if (l13[0] && l14[0] && l23[0] && l24[0])
      {
        var param23 = funParam(l23[1],l14[1]);
        var param14 = funParam(l13[1],l24[1]);
        var line1 = [l23[1],l14,NaN,param23]
        var line2 = [l13[1],l24,NaN,param14]
        var flag = isIntersect(line1,line2)
        if (!flag && lenSquare(l13[1],l14[1],l23[1],l24[1])>minLenRect)
        {
          return [true,l13[1],l14[1],l23[1],l24[1]];
        }
        else if (lenSquare(l13[1],l23[1],l24[1],l14[1])>minLenRect)
        {
          return [true,l13[1],l23[1],l24[1],l14[1]];
        }
      }
      return [false];
    }
    function findRects(linesGroups)
    {
      var rects = []
      var cnt = 0;
      var costil = []
      for (var i = 0; i < linesGroups.length-1; i++)
      {
        for (var j = i + 1; j<linesGroups.length;j++)
        {
          for (var ie = 0; ie < linesGroups[i].length-1; ie++)
          {
            for (var id = ie+1; id <linesGroups[i].length; id++)
            {
              for (var je = 0; je<linesGroups[j].length-1;je++)
              {
                for (var jd = je+1; jd<linesGroups[j].length; jd++)
                {
                  var k = isRect(linesGroups[i][ie],linesGroups[i][id],linesGroups[j][je],linesGroups[j][jd])
                  if (k[0])
                  {
                    cnt++;
                    rects.push(k.slice(1))
                  }
                }
              }
            }
          }
        }
      }
      // console.log(cnt)
      return rects;
    }

    function makeThin(linesGroups)
    {
      var delList = []
      var uniteArray = [];
      var newGr = []
      for (var i = 0; i < linesGroups.length; i++)
      {
          newGr.push([])
          for (var j = 0; j <linesGroups[i].length-1; j++)
          {
              for (var d = j + 1; d<linesGroups[i].length;d++)
              {
                  var pd1 = [i,j]
                  var pd2 = [i,d]
      
                  if (contains(delList,pd1) || contains(delList,pd2))
                  {
                      continue
                  }
                  if (dist_to_line(linesGroups[i][j][0][1],linesGroups[i][j][0][0],linesGroups[i][d][0][1],linesGroups[i][d][0][0],linesGroups[i][d][1][1],linesGroups[i][d][1][0])<minDist)
                  {
                    var mascoord = [linesGroups[i][j][0],linesGroups[i][j][1],linesGroups[i][d][0],linesGroups[i][d][1]]
                    mascoord.sort(compareLines)
                    if (Math.abs(mascoord[1][1] - mascoord[2][1]) < porogDist)
                    {
                      var newl = uniteLines(linesGroups[i][j],linesGroups[i][d])
                      uniteArray.push([i,newl])
                      delList.push([i,j])
                      delList.push([i,d])
                    }
                  }
                  
    
                  
              }
              // console.log(j)
          }
      }
      for (var d = 0;d< delList.length; d++)
      {
        linesGroups[delList[d][0]].splice(delList[d][1],1)
      }
      for (var i = 0; i < uniteArray.length;i++)
      {
        linesGroups[uniteArray[i][0]].push(uniteArray[i][1])
      }
      return linesGroups
    }

    for (var  i = 0; i < lines.length; i++)
    { 
        var k =(lines[i][1][0] - lines[i][0][0])/(lines[i][1][1] - lines[i][0][1])
        lines[i].push(Math.atan(k))
        var param = funParam(lines[i][0],lines[i][1])
        lines[i].push(param)
    }
    lines.sort(sortLinesByAnge)
    var linesGroups = []
    var cnt = 0;
    var i = 0
    for (var i = 0; i < lines.length-1; i++)
    {
        if (Math.abs(lines[i][2] - lines[i+1][2])<angleDif)
        {
            linesGroups.push([lines[i],lines[i+1]])
            i+=2;
            while(i<lines.length)
            {
            if (Math.abs(linesGroups[cnt][0][2] - lines[i][2])<angleDif)
            {
                linesGroups[cnt].push(lines[i])
            }
            else
            {
                cnt++;
                break
            }
            i++;
            }
        }
    
    }
    // console.log(isRect([[780,240],[594,431]],[[986,426],[795,615]],[[789,617],[596,435]],[[989,421],[787,243]]))

    drawNewLines(image,linesGroups,"res\\notThin.png")
    linesGroups = makeThin(linesGroups)
    drawNewLines(image,linesGroups,"res\\Thin.png")
    var rects = findRects(linesGroups)
    // drawNewAlive(image,rects,"src\\rects.png")
    return rects
}
module.exports.findRect = findRect