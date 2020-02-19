var find = function(img)
{
  var image = img.slice()
  const lineBias = 2.5;
  // const maxDistToLine = 4;
  const minLen = img.length/15;
  corners = []
  for (var i = 0; i < image.length; i ++)
  {
    for (var j = 0; j <image[0].length; j++)
    {
      if (image[i][j] == 255 )
      {
        var kcurp = traceLine(i,j)
        if (kcurp.length>0)
        {
          corners.push([kcurp[0],kcurp[kcurp.length-1]])
        } 
      }
    }
  }
  return corners
  // drawNew(image,corners,"Lines.png")
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
            points.pop()
          }
          else
          {
            stack.push(po[f])
          }
        }
      }
      if (points.length>minLen)
      {
        return points.sort(sortByJ);
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
