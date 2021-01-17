const { connected } = require("process");

function ARTag(raw,config)
{
    const height = config.height;
    const width = config.width;
    const whiteColor = config.whiteColor;
    const blackColor = config.blackColor;
	  function loaddata(data)
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
			  console.log("height * width isn't equal to input data length")
		  }
		  for( var i = 0; i < height;i++)
		  {
	  
			  for (var j = 0;j <width;j++)
			  {
				
				  firstImage[i][j] = grayscale(data[cnt]);
				  if (isNaN(firstImage[i][j]))
				  {
					  console.log("Input in grayscale is NaN");
				  }
				  cnt++;
			  }
		  }
		  return firstImage;
	  }
    function findRect(image,lines)
    {
        // const minDist = image.length/20
        const minDist = config.minDist;
        // const minLenRect = image.length/2;
        // const maxLenRect = image.length*2+image[0].length*2
        const minLenRect = config.minLenRect;
        const maxLenRect = config.maxLenRect;
        const porogDist = config.porogDist;
        const angleDif = config.angleDif;
        // const porogDist = 8;
        // const angleDif = 0.8;
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
            if (p1[1] == p2[1])
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
          // var array = [[l1[0],l1[1]],[l2[0],l2[1]],[l3[0],l3[1]],[l4[0],l4[1]]]
          // var mr  =[l1,l2,l3,l4]
          // ma = l1[0];
          // var ind = 0;
          // for (var i = 0; i < 4;i++)
          // {
          //   if (array[i][0]>ma)
          //   {
          //       ma = array[i][0];
          //       ind = i;
          //   }
          // }
          // for (var j = 0; j < 4; j ++)
          // {
          //   if (ind == j)
          //   {
          //     array[ind].push(0)
          //     array[ind].push(ind)
          //     continue
          //   }
          //   else
          //   {
          //     array[j].push(Math.atan2(array[j][0]-array[ind][0],array[j][1]-array[ind][1]))
          //     array[j].push(j)
          //   }
          // }
          // array.sort(function(a,b)
          // {
          //   return a[2]-b[2]
          // })
          // for(var i = 0;i<4;i++)
          // {
          //   if (isConnect(mr[array[i][3]],))
          // }
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
            if (!flag && lenSquare(l13[1],l14[1],l23[1],l24[1])>minLenRect && lenSquare(l13[1],l14[1],l23[1],l24[1])<maxLenRect)
            {
              return [true,l13[1],l14[1],l23[1],l24[1]];
            }
            else if (lenSquare(l13[1],l23[1],l24[1],l14[1])>minLenRect && lenSquare(l13[1],l14[1],l23[1],l24[1])<maxLenRect)
            {
              return [true,l13[1],l23[1],l24[1],l14[1]];
            }
          }
          return [false];
        }
        function findRects(linesGroups)
        {
          var nel = []
          for (var i = 0; i < linesGroups.length;i++)
          {
            // nel.push(linesGroups[i])
            for (var j = 0; j <linesGroups[i].length;j++)
            {
              nel.push(linesGroups[i][j])
            }
          }
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
          // for (var i = 0; i < nel.length-3;i++)
          // {
          //   for (var j = i+1; j < nel.length-2;j++)
          //   {
          //     for (var d = j+1;d<nel.length-1;d++)
          //     {
          //       for (var e = d+1;e<nel.length;e++)
          //       {
          //         var k = isRect(nel[i],nel[j],ne)
          //       }
          //     }
          //   }
          // }
          // console.log(cnt)
          return rects;
        }
        function uniteSeparlines(linesGroups)
        {
          for (var i = 0; i < linesGroups.length; i++)
          {
            for (var j = 0; j < linesGroups[i].length-1; j++)
            {
              for (var d = j + 1; d <linesGroups[i].length;d++)
              {

              }
            }
          }
          return linesGroups;
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
                      // if (dist_to_line(linesGroups[i][j][0][1],linesGroups[i][j][0][0],linesGroups[i][d][0][1],linesGroups[i][d][0][0],linesGroups[i][d][1][1],linesGroups[i][d][1][0])<minDist)
                      // {
                      //   var mascoord = [linesGroups[i][j][0],linesGroups[i][j][1],linesGroups[i][d][0],linesGroups[i][d][1]]
                      //   mascoord.sort(compareLines)
                      //   if (Math.abs(mascoord[1][1] - mascoord[2][1]) < porogDist)
                      //   {
                      //     var newl = uniteLines(linesGroups[i][j],linesGroups[i][d])
                      //     uniteArray.push([i,newl])
                      //     delList.push([i,j])
                      //     delList.push([i,d])
                      //   }
                      // }
                      var poin = [linesGroups[i][j][0],linesGroups[i][j][1],linesGroups[i][d][0],linesGroups[i][d][1]]
                      if (distPoints(linesGroups[i][j][1],linesGroups[i][d][0])<config.minLen || distPoints(linesGroups[i][j][0],linesGroups[i][d][1])<config.minLen)
                      {
                          var newl = uniteLines(linesGroups[i][j],linesGroups[i][d])
                          uniteArray.push([i,newl])
                          delList.push([i,j])
                          delList.push([i,d])
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
            var k = Math.atan2(lines[i][1][0] - lines[i][0][0],lines[i][1][1] - lines[i][0][1])
            if (Math.abs(k-Math.PI/2)<angleDif)
            {
              k = - Math.PI/2
            }
            var b = lines[i][1][1]-lines[i][1][0]*k;
            lines[i].push(k)
            var param = funParam(lines[i][0],lines[i][1])
            lines[i].push(param)
            
        }
        lines.sort(sortLinesByAnge)
        var linesGroups = []
        var cnt = 0;
        var i = 0
        for (var i = 0; i < lines.length-1; i++)
        {
            if (Math.abs(lines[i][2]- lines[i+1][2])<angleDif)
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
                    i--;
                      cnt++;
                      break
                  }
                i++;
                }
            }
            // else
            // {
            //   linesGroups.push([lines[i]]);
            //   cnt++;
            // }
        
        }
        // console.log(isRect([[780,240],[594,431]],[[986,426],[795,615]],[[789,617],[596,435]],[[989,421],[787,243]]))
        linesGroups = makeThin(linesGroups)
        // drawNewLinesGroup(image,linesGroups,"linesgroup.jpg")
        var rects = findRects(linesGroups)
        // drawNewAlive(image,rects,"src\\rects.png")
        rects.sort(function(a,b)
        {
          return lenSquare(b[0],b[1],b[2],b[3]) - lenSquare(a[0],a[1],a[2],a[3])
        })
        return rects
    }
    function find(img)
    {
      var image = img.slice()
      const lineBias = config.lineBias;
      // const maxDistToLine = 4;
      const minLen = config.minLen;
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
//   const defaultOptions = {
//     lowThreshold: 40,
//     highThreshold: 55,
//     // gaussianBlur: 1.1
//   };
  const defaultOptions = config.cannyOptions;
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
//	function truncP(s)
//	{
//		if (s - Math.round(s)>0.5)
//		{
//		}
//	}
  function gaus(image,filter,rad)
  {
    var newConv = []
    //    var rad = Math.trunc(filter.length/2
    //  var rad = 1;
    for (var ds = 0; ds<image.length;ds++)
    {
      newConv.push([])
      for(var dj = 0; dj<image[0].length;dj++)
      {
        newConv[ds].push(image[ds][dj])
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
  function convolution(image,filter,rad)
  {
  
    var newConv = []
//    var rad = Math.trunc(filter.length/2
//  var rad = 1;
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
    var newimg = []
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
  
  function cannyEdgeDetector(image, options) {
    // image.checkProcessable('Canny edge detector', {
    //     bitDepth: 8,
    //     channels: 1,
    //     components: 1
//    options = Object.assign({}, defaultOptions, options);
  
    const brightness = 255
    var gfilter3 = [[1/16,2/16,1/16],[2/16,4/16,2/16],[1/16,2/16,1/16]]
    var gfilter = [[1/273,4/273,7/273,4/273,1/273],[4/273,16/273,26/273,16/273,4/273],[7/273,26/273,41/273,26/273,7/273],[1/273,4/273,7/273,4/273,1/273],[4/273,16/273,26/273,16/273,4/273]]
    gf = gaus(gaus(image,gfilter,2),gfilter,2)
    gf = gaus(gf,gfilter,2)
  
    
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
  
  function grayscale(rgb) {
    m = rgb.trim();
    // var m = rgb;
    return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
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
    var black_bias = config.blackBias;
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
    return sreds>config.blackCageAmount
  }
  // function isBlackCage(p1,p2,p3,p4,image)
  // {
  //   var black_bias = config.blackBias;
  //   var l1 = allPoints(p1,p2,image);
  //   var l2 = allPoints(p2,p3,image);
  //   var l3 = allPoints(p3,p4,image);
  //   var l4 = allPoints(p4,p1,image);
  //   var alp = l1.concat(l2,l3,l4);

  //   // alp.push([p1.y,p1.x],[p2.y,p2.x],[p3.y,p3.x],[p4.y,p4.x])
  //   alp.sort(function(a,b)
  //   {
  //     if (a[0] == b[0])
  //     {
  //       return a[1] - b[1];
  //     }
  //     else
  //     {
  //       return a[0] - b[0];
  //     }
  //   })
  //   var dalp = []
  //   var cnt = 0;
  //   for (var i = 0; i <alp.length;i++)
  //   {
  //     // dalp.push([alp[i][0]])
  //     dalp.push([])
  //     var ci = i;
  //     while (i != alp.length && alp[i][0] == alp[ci][0])
  //     {
  //       dalp[cnt].push(alp[i][1]);
  //       i++;
        
  //     }
  //     dalp[cnt].sort(function(a,b)
  //     {
  //       return a-b
  //     })
  //     dalp[cnt].unshift(alp[ci][0])
  //     i = i -1
  //     cnt++
  //   }
  //   var sumColor=0;
  //   var zn = 0
  //   var vs = 0;
  //   for (var i = 0; i < dalp.length; i++)
  //   {
  //     if (dalp[i].length == 2)
  //     {
  //       sumColor+=image[dalp[i][0]][dalp[i][1]]

  //       if (image[dalp[i][0]][dalp[i][1]] < black_bias)
  //       {
  //         zn++
  //       }  
  //       // zn+= image[dalp[i][0]][dalp[i][1]]
  //       vs++;
  //     }
  //     else
  //     {
  //       for (var j = dalp[i][1]; j <= dalp[i][dalp[i].length-1]; j++)
  //       {
  //         sumColor+=image[dalp[i][0]][j]

  //         vs++;
  //         if (image[dalp[i][0]][j] < black_bias)
  //         {
  //           zn++;
  //         }
  //         // zn+= image[dalp[i][0]][j]
  //       }
  //     }
  //   }
  //   var sreds = sumColor/vs
  //   console.log(sreds)
  //   return sreds>config.blackBias
  // }
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
    // drawNewMatrix1(image,arpoints,"matrix_points.jpg")
    var matrix = [];

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
          matrix[i].push(blackColor);
        }
        else
        {
          matrix[i].push(whiteColor);
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
        // 1 белый цвет 
      if (copy[LenSide-3][LenSide-3] == whiteColor)
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
  var data1 = raw;
  firstImage = loaddata(data1);
  drawNew(firstImage,[],"raw.jpg")
  var gfilter3 = [[1/16,2/16,1/16],[2/16,4/16,2/16],[1/16,2/16,1/16]]
  var gfilter = [[1/273,4/273,7/273,4/273,1/273],[4/273,16/273,26/273,16/273,4/273],[7/273,26/273,41/273,26/273,7/273],[1/273,4/273,7/273,4/273,1/273],[4/273,16/273,26/273,16/273,4/273]]
  var gausImage = convolution(firstImage,gfilter,2)
  imgf = cannyEdgeDetector(firstImage,defaultOptions);
  drawNewLines1(imgf,[],"canny.jpg")
//   var lines = findCorners.find(imgf)
  var lines = find(imgf);
  drawNewLines1(imgf,lines,"lines.jpg")
//   var rect = findRect.findRect(imgf,lines)
  var rect = findRect(imgf,lines)
  if (rect.length>0)
  {
    rect.sort(function(a,b)
    {
      return 
    })
    var matr = countArtag(rect[0],gausImage,config.artagDimensions)
    return matr;
    
  }
  return -1
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



  new_contr = []



  for (var i = 0; i < pass.length; i++)

  {

    var sum = 0;

    var ind = pass[i] + 1;

    sum -= rigt[ind]

    for (var j = ind; j<rigt.length; j+=2*ind)

    {

        for (var k = ind; k < 2*ind; k++)

        {

            sum += rigt[k - 1]

        }

    }

    if (sum % 2 == 0)

        new_contr.push(0)

    else

        new_contr.push(1)

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

      if (sr == 6) 

      {

          console.log("asdsad")

      }

    var zn = sd[sr*2]*2 + sd[sr*2+1]

      comands.push(zn);

  }

  return(comands)

}

fs = require("fs")
var heights = 120;
var widths = 160;
config = 
{
    height:120,
    width:160,
    lineBias:1.2,
    minLen:15,
    whiteColor:1,
    blackColor:0,
    cannyOptions:{
        lowThreshold: 40,
        highThreshold: 55,
        // gaussianBlur: 1.1
      },
    artagDimensions:8,
    blackBias:60,
    minDist:15,
    minLenRect:heights/2,
    maxLenRect:heights*2 + widths*2,
    porogDist:15,
    angleDif:0.8,
    blackCageAmount:0.5,
    minLineLen:heights/3,
    difB:5
}

var da = fs.readFileSync("/media/d/Projects/IRS2021/2etap/artagTupo/data/02","utf8").replace(/\s+/g, ' ').trim();
console.log("conected")
var test = da.split(" ");
var matrix = ARTag(test,config)
console.log(decode(matrix))
if (matrix!=-1)
{
  for (var i = 0; i < 6; i++)
  {
    var s = ""
    for (var j = 0; j < 6; j++)
    {
      s += matrix[i][j] + " "
    }
    console.log(s + "\n")
  }
}
console.log("done")
// var da = fs.readFileSync("C:\\Projects\\IRS2021\\test\\ARtag\\src\\0_1.txt","utf8").replace(/\s+/g, ' ').trim()
// var text = da.split(",")
// var picks = [9,8,9,9,5,5,8,10,12,8,10,11,8,7,5,6]
// allgood = true;
// for (var we = 0; we<16;we++)
// {
//   for(var hl = 1; hl<=picks[we];hl++)
//   {
//         // console.log(hl);
//         var strds = "C:\\Projects\\IRS2021\\test\\ARtag\\src\\" +we+ "_"+hl+".txt";
//         if (we == 1 && hl == 2 )
//         {
//             console.log("dde");
//         }
//         var da = fs.readFileSync(strds, "utf8").trim().split(",");
//         var ma = ARTag(da,config);
//         // var znach = znach[0][1] `
//         if (ma == -1)
//         {
//             console.log(we + " " + hl )

//             znach = -1
//             break
//         }

//         znach = decode5(ma);
    

//         if (znach!=we)
//         {
//             console.log(we + " " + hl )
//             console.log("help")
//             break
//         // drawNewMatrix(,arpoints,"res/matrix.jpg")
//         }
//     }
//     if (znach!=we)
//     {
//         allgood = false;
//         console.log(we + " " + hl )
//         console.log("help")
//         break
//     }
// }
// if (allgood)
// {
//     console.log("ok")
// }
// else
// {
//     console.log("no ok")
// }

function decode5(matr)
{
    babr = []
    for (var i=0; i < matr.length; i++) {
        babr.push([])
        for (var j = 0; j < matr[0].length; j++)
        {
            if (matr[i][j] == 0)
            {
                babr[i].push(1);
                
            }
            else
            {
                babr[i].push(0);
            }
        }
    }
    // try
    // {
        var a = babr[0][1]*8 + babr[1][0]*4 + babr[1][2]*2 + babr[2][1]
    // }catch( e)
    // {
    //     console.log("trik")
    // }
  return a;
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

    Canvas = require("canvas")
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

    Canvas = require("canvas")
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
function drawNewLinesGroup(image,points,name)
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
        for (var j = 0; j < points[c].length;j++)
        {
        // var y1 = corners[c][0]
        // var x1 = corners[c][1]
        // var curi = 4*(y1*width+x1)

          ctx.beginPath();
          ctx.moveTo(points[c][j][0][1], points[c][j][0][0]);
          ctx.lineTo(points[c][j][1][1], points[c][j][1][0]);
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