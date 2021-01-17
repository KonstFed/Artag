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
            if (tmpznach == 10)
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
var find = function(img)
{
  var image = img.slice()
  const lineBias = 1.3;
  // const maxDistToLine = 4;
  const minLen = 15;
  corners = [];
  var otlad = [];

  for (var i = 0; i < image.length; i ++)
  {
    for (var j = 0; j <image[0].length; j++)
    {
      if (image[i][j] == 255 )
      {

        otlad.push([i,j])
        var kcurp = traceLine(i,j)
        
        if (kcurp.length>0)
        {
          // console.log(i+" : "+ j + " -+- " + kcurp[kcurp.length-1][0] + " : "+ kcurp[kcurp.length-1][1])
          var localCorners = findEnds(kcurp)
          corners.push(localCorners)
        } 
      }
    }
  }
  return corners

  function distPoints(p1,p2)
  {
    var sa = Math.sqrt(Math.pow(Math.abs(p1[0] - p2[0]),2) + Math.pow(p1[1]-p2[1],2) )
    return sa;
  }
  function findEnds(points)
  {
    var my=0;
    var mx=0;
    for (var ic = 0; ic<points.length;ic++)
    {
      my += points[ic][0];
      mx += points[ic][1];

    }
    my /= points.length;
    mx /= points.length;
    points.sort(function(a,b)
    {
      return distPoints(b,[my,mx]) - distPoints(a,[my,mx])
    })
    
    var distM = distPoints(points[0],[my,mx])
    for (var id = 1; id< points.length; id++)
    {
      if (distM<distPoints(points[0],points[id]))
      {
        if (points[0][1]>points[id][1])
        {
          return([points[id],points[0]])
        }
        else
        {
          return([points[0],points[id]])
        }
      }
    }

  }
  function nextPoint(i,j,rad)
  {
    var answ = []
    for (var curi = i-rad; curi<= i+rad; curi++)
    {
      for (var curj = j-rad; curj <= j + rad; curj++)
      {
        if (curi>= 0 && curi < image.length && curj>=0 && curj<image[0].length && (curi != i || curj != j)  && image[curi][curj] == 255)
        {
          image[curi][curj] = 120
          answ.push([curi,curj]);
        }
      }
    }
    return answ;
  }

  function isOnLine(points,startp)
  {
    err = 0
    for (var izec = 1; izec<points.length-1; izec++)
    {
      err += dist_to_line(points[izec][0],points[izec][1],startp[0],startp[1],points[points.length-1][0],points[points.length-1][1])
    }
    err = err/points.length
    return(err<lineBias)
  }

  function dist_to_line(x1,y1,x2,y2,x3,y3)
  {
    osn = Math.sqrt((x3-x2)*(x3-x2) + (y3-y2)*(y3-y2))
    return Math.abs(((x3-x2)*(y1 - y2)- (y3-y2)*(x1-x2))/osn)
  }

  function sortByJ(a,b)
  {
    if (a[1]<b[1])
    {
      return -1;
    }
    if (a[1]>b[1])
    {
      return 1;
    }
    else
    {
      return a[0] - b[0]
    }
  }
  

  function traceLine(starti,startj)
  {
    // image[starti][startj] = 120;
    // points = [[starti,startj]];
    // curp = nextPoint(starti,startj,1);
    // points.push(curp[0]);
    // while(curp.length > 0)
    // {
      
    //   curp = nextPoint(points[points.length-1],points[points.length -1],1);
    //   points.push(curp);
    //   if (!isOnLine(points))
    //   {
    //     if (points.length>minLen)
    //     {
    //       return [[points[0][0],points[0][1]],[points[points.length-2][0],points[points.length-2][1]]]
    //     }
    //     else
    //     {
    //       return [[-1,-1],[-1,-1]]
    //     }
    //   }
      var points = []
      var stack = []
      var loose = []
      image[starti][startj] = 120
      stack.push([starti,startj])
      while(stack.length>0)
      {
        var curps = stack.shift()
        var po = nextPoint(curps[0],curps[1],1)
        for (var f = 0; f<po.length; f++)
        {
          points.push(po[f])
          if (!isOnLine(points,[starti,startj]))
          {
            loose.push(points.pop())
          }
          else
          {
            stack.push(po[f])
          }
        }
      }
      for (var sd = 0; sd<loose.length; sd++)
      {
        image[loose[sd][0]][loose[sd][1]] = 255;
      }
      if (points.length>minLen)
      {
        return points;
      }
      else
      {
        return [];
      }
    }
    

    // if (points.length>minLen)
    // {
    //   return [[points[0][0],points[0][1]],[points[points.length-1][0],points[points.length-1][1]]]
    // }
    // else
    // {
    //   return [[-1,-1],[-1,-1]]
    // }
      
  

}
module.exports.find = find;
