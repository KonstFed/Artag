var __interpretation_started_timestamp__;
var pi = 3.141592653589793;
 
var main = function()
{
    __interpretation_started_timestamp__ = Date.now();
    brick.gyroscope().calibrate(2000);
    script.wait(2000);
 
    function countArtag(image,height,width)
    {
        function grayscale(rgb) {
            m = rgb.trim();
            return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
        }
        function toGrayscale(image)
        {
            for (var i = 0;i<image.length;i++)
            {
                for (var j = 0;j<image[i].length;j++)
                {
                    image[i][j] = grayscale(image[i][j])
                }
            }
        }
        function noiseReduction(image)
        {
            //напишу пойзже, если попаду на финал
        }
        function countDifference(cur,nuclear,t)
        {
            tmp = Math.pow((cur-nuclear)/t,6)
            c = Math.exp(-tmp);
            return c;
        }
        function findCorners(image,rad,g)
        {
            // image[1][2]=0;
            var cornerimage = []
            for (var i = 0;i<image.length;i++)
            {
                cornerimage.push([])
                for (var j = 0;j<image[0].length;j++)
                {
                    cornerimage[i].push(image[i][j])
                }
            }
 
            var corners = []
            for (var i = rad;i<image.length-rad;i++)
            {
                for (var j = rad;j<image[i].length-rad;j++)
                {
                    var nuclearR = 0
                    nsum = 0
                    for (var c = i-rad;c<=i+rad;c++)
                    {
                        for (var d = j - rad;d<=j+rad;d++)
                        {
                            nsum = nsum + countDifference(image[c][d],image[i][j],10)
                        }
                    }
                    if (nsum<g)
                    {
                        nuclearR = 255
                        corners.push([i,j])
 
                    }
                    else
                    {
                        nuclearR = 0
                    }
                    cornerimage[i][j] = nuclearR
                }
            }
 
            var corner=centroid(cornerimage,rad)
            return corner
 
        }
        function centroid(cornerImage,rad)
        {
            var corners = []
            for (var i = rad;i<cornerImage.length-rad;i++)
            {
                for (var j = rad;j<cornerImage[i].length-rad;j++)
                {
                    if (cornerImage[i][j]>0)
                    {
                        var current = [[i,j]]
                        maxznach = current[0]
                        mar = cornerImage[i][j]
                        while(current.length>0)
                        {
                            cur = current[0]
                            if (cornerImage[cur[0]][cur[1]]>mar)
                            {
                                maxznach = [cur[0],cur[1]]
                                mar = cornerImage[maxznach[0]][maxznach[1]]
                            }
                            cornerImage[cur[0]][cur[1]] = 0
                            current.shift()
                            if (cur[0]-1>=rad && cornerImage[cur[0]-1][cur[1]] >0)
                            {
                                current.push([cur[0]-1,cur[1]])
                                if (cur[1]-1>=rad && cornerImage[cur[0]-1][cur[1]-1]>0)
                                {
                                    current.push([cur[0]-1,cur[1]-1])
                                }
                                if (cur[1]+1<image[0].length-rad && cornerImage[cur[0]-1][cur[1]+1]>0)
                                {
                                    current.push([cur[0]-1,cur[1]+1])
                                }
                            }
                            if (cur[0]+1<image.length-rad && cornerImage[cur[0]+1][cur[1]]>0)
                            {
                                current.push([cur[0]+1,cur[1]])
                                if (cur[1]-1>=rad && cornerImage[cur[0]-1][cur[1]-1]>0)
                                {
                                    current.push([cur[0]+1,cur[1]-1])
                                }
                                if (cur[1]+1<image[0].length-rad && cornerImage[cur[0]-1][cur[1]+1]>0)
                                {
                                    current.push([cur[0]+1,cur[1]+1])
                                }
                            }
                            if (cur[1]-1>=rad && cornerImage[cur[0]][cur[1]-1]>0)
                            {
                                current.push([cur[0],cur[1]-1])
                            }
                            if (cur[1]+1<image[0].length - rad && cornerImage[cur[0]][cur[1]+1]>0)
                            {
                                current.push([cur[0],cur[1]+1])
                            }
                        }
                        cornerImage[maxznach[0]][maxznach[1]] = mar
                        corners.push([maxznach[0],maxznach[1]])
                    }
                }
            }
            return corners
        }
        function evaluation(x1,y1,x2,y2,img)
        {
            height = img.length;
            width = img[0].length;
       
            xV = x2 - x1;
            yV = y2 - y1;
            dx = x2 - x1;
            dy = y2 - y1;
       
            lenv = Math.sqrt(xV*xV+yV*yV);
            xV = Math.round(xV/lenv*4);
            yV = Math.round(yV/lenv*4);
       
            yV1 = yV;
            yV = xV;
            xV = - yV1;
            yV2 = - yV;
            xV2 = - xV;
       
            if (dx>0) sign_x = 1;
            else if (dx<0) sign_x = -1;
            else sign_x = 0;
       
            if (dy>0) sign_y = 1;
            else if (dy<0) sign_y = -1;
            else sign_y = 0;
       
            cnt = 0;
            cnt_all = 0;
            if (dx<0) dx = -dx;
            if (dy<0) dy = -dy;
       
            if (dx>dy)
            {
                pdx = sign_x;
                pdy = 0;
                es = dy;
                el = dx;
            }
            else
            {
                pdx = 0;
                pdy = sign_y;
                es = dx;
                el = dy;
            }
       
            x = x1
            y = y1
            error = parseInt(el/2);
            t = 0;
           
            xW = x + xV;
            yW = y + yV;
            xW2 = x + xV2;
            yW2 = y + yV2;
       
            if (xW>= 0 && xW<width && yW>=0 && yW<height && xW2 >= 0 && xW2 <width && yW2 >= 0 && yW2<height && img[yW][xW] > img[yW2][xW2]){
                cnt = cnt + 1;
            }
            cnt_all++;
            while(t<el)
            {
                error = error-es;
                if (error<0)
                {
                    error += el
                    x += sign_x
                    y += sign_y
                }
                else
                {
                    x += pdx
                    y += pdy
                }
                t += 1
                xW = x + xV
                yW = y + yV
                xW2 = x + xV2
                yW2 = y + yV2
                if (xW>= 0 && xW<width && yW>=0 && yW<height && xW2 >= 0 && xW2 <width && yW2 >= 0 && yW2<height)
                {
                    if (Math.abs(img[yW][xW]-img[yW2][xW2]>50))
                    {
                        cnt++;
                    }
                }
                cnt_all++;
            }
            dif = cnt/cnt_all
            return (dif)
        }
        function findBorders(image,corners,gPorog)
        {
            var lines = []
            for (var i = 0;i<corners.length;i++)
            {
                for (var j = 0;j<corners.length;j++)
                {
                    if (j == i)
                    {
                        continue;
                    }
                    var x1,y1,x2,y2;
                    x1 = corners[i][1];
                    y1 = corners[i][0];
                    x2 = corners[j][1];
                    y2 = corners[j][0];
 
                    var cureval = evaluation(x1,y1,x2,y2,image)
                    if (cureval>gPorog)
                    {
                        var dist =Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
                        lines.push([y1,x1,y2,x2,dist])
                    }
 
                }
            }
            lines.sort(function(a,b)
            {
                return b[4]-a[4];
            });
            var data = []
 
            var bs = lines.slice(0,4);
            var tmp = [];
            tmp.push(bs[0])
            while(tmp.length>0)
            {
                var s = false
                var cur = tmp.shift()
                data.push([cur[0],cur[1]])
                for (var i = 0;i<bs.length;i++)
                {
                    if (data.length>3)
                    {
                        s = true;
                        break;
                    }
                    if (bs[i][0] == cur[2] && bs[i][1] == cur[3])
                    {
                        tmp.push(bs[i])
                    }
                }
                if (s)
                {
                    break
                }
            }
            return data
        }
        function isBlackCage(p1,p2,img)
        {
            black_bias = 80;
            cnt = 0;
            cntall = 0;
            // if (img == undefined)
            // {
            //     console.log("wfdssdsfwqsa")
            // }
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
 
 
        function countcoef(x1,y1,x2,y2)
        {
            var k,b
            if (x1 == x2)
            {
                k = 120
                b = y1-x1*k
            }
            else
            {
                k = (y1-y2)/(x1-x2)
                b = y1 - x1*k
            }
            return [k,b]
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
        function artagMatrix(corners,image)
        {
            function compare(a,b)
            {
                return a[0][0] - b[0][0];
            }
            var lines = [];
            var ind = [];
            var verx = []
            var cnt = 0;
            for (var i = 0;i<4;i++)
            {
                if (Math.abs(corners[i][1]-corners[(i+1)%4][1])>15)
                {
                    var x1,y1,x2,y2;
                    verx.push([])
                    x1 = Math.min(corners[i][1],corners[(i+1)%4][1]);
                    y1 = Math.min(corners[i][0],corners[(i+1)%4][0]);
                    x2 = Math.max(corners[i][1],corners[(i+1)%4][1]);
                    y2 = Math.max(corners[i][0],corners[(i+1)%4][0]);
                    var tmp = countcoef(x1,y1,x2,y2)
                    var difx =Math.abs(x1 - x2)/5
                    for (var j = 1;j<5;j++)
                    {
                       
                        var cury = Math.round(tmp[0]*(x1 + j*difx) + tmp[1])
                        verx[cnt].push([cury,Math.round(x1+j*difx)])
                    }
                    lines.push(tmp)
                    ind.push([i,(i+1)%4])
                    cnt++;
                }
            }
            var cornerData = []
            for (var i = 0;i<4;i++)
            {
                cornerData.push([])
                for (var j = 0;j<4;j++)
                {
                    cornerData[i].push([])
                }
            }
            var cnt=0;
            for (var i = 0;i<verx[0].length;i++)
            {
                var x1,y1,x2,y2,coef,difx;
                x1 = verx[0][i][1];
                y1 = verx[0][i][0];
                x2 = verx[1][i][1];
                y2 = verx[1][i][0];
                coef = countcoef(x1,y1,x2,y2)
                difx = Math.abs(x1-x2)/5
           
                for (var j = 1;j<5;j++)
                {
                    var curx = j*difx+Math.min(x1,x2)
                    var cury = coef[0]*curx + coef[1]
                    cornerData[4-j][cnt] = [Math.round(cury),Math.round(curx)]
                }
                cnt++;
                cnt = cnt%4
            }
            cornerData.sort(compare)
            var matrix = []
            for (var i = 0;i<3;i++)
            {
                matrix.push([])
                for (var j = 0;j<3;j++)
                {
                    if (isBlackCage({x:cornerData[i][j][1],y:cornerData[i][j][0]},{x:cornerData[i+1][j+1][1],y:cornerData[i+1][j+1][0]},image))
                    {
                        matrix[i].push(1)
                    }
                    else
                    {
                        matrix[i].push(0)
                    }
                }
            }
            var flags = false
            for (var c = 0; c<4;c++)
            {
                if (matrix[2][2]==0){
                    flags = true
                    break;
                }
                else{
                    matrix = rotateMatrix(matrix);
                }
            }
            if (flags)
            {
                var znach = matrix[0][1]*8+matrix[1][0]*4 + matrix[1][2]*2 + matrix[2][1]  
                return znach;
            }
            else
            {
                return -1
            }
        }
        var corn = findCorners(image,2,12)
        var bord = findBorders(image,corn,0.6)
        var zn = artagMatrix(bord,image)
        return zn
    }
var turnLeft = function()
{
    var angle = (brick.gyroscope().read()[6] - 90000) / 1000;
    if (-275 < angle && angle < -265)
    {
        angle = 90;
    }
    while (brick.gyroscope().read()[6] / 1000 != angle)
    {
        var delta = angle - brick.gyroscope().read()[6] / 1000;
        brick.motor(M3).setPower(-delta);
        brick.motor(M4).setPower(delta);
        if (-1 < delta && delta < 1)
        {
            break;
        }
        script.wait(10);
    }
 
    brick.motor(M3).setPower(0);
    brick.motor(M4).setPower(0);
    script.wait(100);
}
 
    var turnRight = function()
    {
        var angle = (brick.gyroscope().read()[6] + 90000) / 1000;
        if (275 > angle && angle > 265)
        {
            angle = -90;
        }
        while (brick.gyroscope().read()[6] / 1000 != angle)
        {
            var delta = angle - brick.gyroscope().read()[6] / 1000;
            brick.motor(M3).setPower(-delta);
            brick.motor(M4).setPower(delta);
            if (-1 < delta && delta < 1)
            {
                break;
            }
            script.wait(10);
        }
     
        brick.motor(M3).setPower(0);
        brick.motor(M4).setPower(0);
        script.wait(100);
    }
     
    var move = function(dir)
    {
        brick.encoder(E3).reset();
        brick.encoder(E4).reset();
        while (brick.sensor(A1).read() > 25 && brick.encoder(E3).read() < 1480 && brick.encoder(E3).read() < 1480)
        {
             var a=brick.gyroscope().read()[6];
            switch(dir){
                case 0:
            delta =brick.encoder(E3).read()-brick.encoder(E4).read();
            brick.motor(M3).setPower(100 - delta);
            brick.motor(M4).setPower(100 + delta);
            script.wait(10);break;
                case 1:
            delta =(-90000-a)*0.01;
            brick.motor(M3).setPower(100 - delta);
            brick.motor(M4).setPower(100 + delta);
            script.wait(10);break;
                case 2:
            delta =(0-a)*0.01;
            brick.motor(M3).setPower(100 - delta);
            brick.motor(M4).setPower(100 + delta);
            script.wait(10);break;
                case 3:
            delta =(90000-a)*0.01;
            brick.motor(M3).setPower(100 - delta);
            brick.motor(M4).setPower(100 + delta);
            script.wait(10);break;
        }
       
        brick.motor(M3).setPower(0);
        brick.motor(M4).setPower(0);
        script.wait(100);}
    }
    function grayscale(rgb) {
        m = rgb.trim();
        return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
    }
    var takeDimension = function()
    {
        var mas = [0, 0, 0]
        if (brick.sensor(A3).read() < 50)
            mas[0] = 1;
        if (brick.sensor(A1).read() < 50)
            mas[1] = 1;
        if (brick.sensor(A2).read() < 50)
            mas[2] = 1;
       
        return mas;
    }
    function addToLocalMap(localmap,curpos,dir,pokaz)
    {
        var xre, yre, dirl,dirp;
        var emptyLine = []
        for (var cd = 0; cd<localmap[0].length;cd++)
        {
            emptyLine.push([-1, -1, -1, -1])
        }
        if (curpos[1] == -1)
        {
            localmap.unshift(emptyLine);
            yre = 0;
            xre = curpos[0];
 
        }
        else if(curpos[1] == localmap.length)
        {
            localmap.push(emptyLine);
            yre = localmap.length-1;
            xre = curpos[0];
        }
        else if(curpos[0] == -1)
        {
            for (var js = 0; js<localmap.length;js++)
            {
                localmap[js].unshift([-1,-1,-1,-1])
            }
            xre = 0;
            yre = curpos[1];
 
        }
        else if(curpos[0] == localmap[curpos[1]].length)
        {
            for (var js = 0; js<localmap.length;js++)
            {
                localmap[js].push([-1,-1,-1,-1])
            }
            xre = localmap[curpos[1]].length-1
            yre = curpos[1]
        }
        else
        {
            xre = curpos[0];
            yre = curpos[1];
        }
        if (dir==0)
        {
            dirl = 3
            dirp = 1
        }
        else if (dir == 3)
        {
            dirl = 2;
            dirp = 0;
        }
        else
        {
            dirl = dir-1;
            dirp = dir+1;
        }
        // if (xre >7 || yre >7)
        // {
        //     console.log("help")
        // }
        localmap[yre][xre][dirl] = pokaz[0];
        localmap[yre][xre][dir] = pokaz[1];
        localmap[yre][xre][dirp] = pokaz[2];
        return [xre,yre];
 
    }
    function update(localmap)
    {
        for (var iv = 0;iv<localmap.length;iv++)
        {
            for (var jv = 0; jv<localmap[iv].length;jv++)
            {
                if (iv==0)
                {
                    if (localmap[iv][jv][3] == -1)
                    {
                        localmap[iv][jv][3] = localmap[iv+1][jv][1];
                    }
                    else
                    {
                        localmap[iv+1][jv][1] = localmap[iv][jv][3]
                       
                    }
                }
                else if(iv == localmap.length-1)
                {
                    if (localmap[iv][jv][1] == -1)
                    {
                        localmap[iv][jv][1] = localmap[iv-1][jv][3];
 
                    }
                    else
                    {
                        localmap[iv-1][jv][3] = localmap[iv][jv][1];
                    }
                }
                else
                {
                    if (localmap[iv][jv][1] == -1)
                    {
                        localmap[iv][jv][1] = localmap[iv-1][jv][3];
 
                    }
                    else
                    {
                        localmap[iv-1][jv][3] = localmap[iv][jv][1];
                    }
                    if (localmap[iv][jv][3] == -1)
                    {
                        localmap[iv][jv][3] = localmap[iv+1][jv][1];
                    }
                    else
                    {
                        localmap[iv+1][jv][1] = localmap[iv][jv][3]
                       
                    }
                }
                if (jv==0)
                {
                    if (localmap[iv][jv][2] == -1)
                    {
                        localmap[iv][jv][2] = localmap[iv][jv+1][0];
                    }
                    else
                    {
                        localmap[iv][jv+1][0] = localmap[iv][jv][2];
                    }
                }
                else if (jv == localmap[iv].length-1)
                {
                    if (localmap[iv][jv][0] == -1)
                    {
                        localmap[iv][jv][0] = localmap[iv][jv-1][2]
                    }
                    else
                    {
                        localmap[iv][jv-1][2] = localmap[iv][jv][0]
                    }
                }
                else{
                    if (localmap[iv][jv][0] == -1)
                    {
                        localmap[iv][jv][0] = localmap[iv][jv-1][2]
                    }
                    else
                    {
                        localmap[iv][jv-1][2] = localmap[iv][jv][0]
                    }
                    if (localmap[iv][jv][2] == -1)
                    {
                        localmap[iv][jv][2] = localmap[iv][jv+1][0];
                    }
                    else
                    {
                        localmap[iv][jv+1][0] = localmap[iv][jv][2];
                    }
                }
            }
        }
    }
    function changeCoord(xvs,yvs,dir)
    {
        var xv,yv;
        xv = xvs;
        yv = yvs;
        if (dir == 0)
        {
            xv = xv -1;
        }
        else if (dir == 1)
        {
            yv = yv - 1
        }
        else if (dir == 2)
        {
            xv = xv + 1
        }
        else if (dir == 3)
        {
            yv = yv + 1;
        }
        return [xv,yv]
    }
    function mazeGo()
    {
        // var maze = [[[1, 1, 0, 1], [0, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1]],
        // [[1, 1, 1, 1], [1, 0, 0, 1], [0, 1, 0, 1], [0, 1, 1, 0], [1, 1, 1, 1], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]],
        // [[1, 0, 1, 1], [1, 0, 1, 1], [1, 1, 1, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 1, 0]],
        // [[1, 1, 1, 0], [1, 1, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0], [0, 0, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0], [0, 0, 1, 0]],
        // [[1, 0, 1, 0], [1, 0, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [1, 0, 0, 1], [0, 0, 1, 1]],
        // [[1, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 1, 0], [1, 1, 0, 0], [0, 1, 1, 0]],
        // [[1, 0, 1, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [1, 0, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0], [0, 0, 1, 0]],
        // [[1, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 1, 1]]]
       
   
   
   
        // var path = require('path')
        // var Canvas = require('canvas')
   
        function prov(localmap)
        {
            if(localmap.length!=8)
            {
                return false;
            }
            else
            {
                for (var i = 0; i < localmap.length;i++)
                {
                    if (localmap[i].length==8)
                    {
                        return true;
                    }
                }
            }
            return false;
        }
   
        var localmap =[]
        var x,y,dir,curx,cury;
        curx = 0;
        cury = 0;
        dir = 2;
        var curpos = [curx,cury]
        localmap.push([])
        localmap[0].push([-1,-1,-1,-1])
        var tmo = takeDimension();
        var tmol = dir-1;
        var tmor = dir+1;
        if (dir == 3)
        {
            tmor = 0;
        }
        else if (dir == 0)
        {
            tmol = 3
        }
        localmap[0][0][tmol] = tmo[0];
        localmap[0][0][tmor] = tmo[2];
        localmap[0][0][dir] = tmo[1];
        // drawNew(maze,[x,y],"_sup",2)
        var cnt = 0;
        while(true)
        {
            cnt++;
            pokaz = takeDimension();
            curpos = addToLocalMap(localmap,curpos,dir,pokaz)
            // drawNew(localmap,curpos,cnt,dir)
            if (localmap.length>1 && localmap[0].length>1)
            {
                update(localmap)
   
            }
            if (prov(localmap))
            {
                break
            }
            if (pokaz[2] == 0)
            {
                turnRight();
                dir = (dir+1)%4;
                move(dir)
                curpos = changeCoord(curpos[0],curpos[1],dir)
               
            }
            else if (pokaz[1] == 0)
            {
                move(dir)
                curpos = changeCoord(curpos[0],curpos[1],dir)
            }
            else if (pokaz[0] == 0)
            {
                turnLeft()
                dir = dir-1;
                if (dir==-1)
                {
                    dir = 3;
                }
                move(dir);
                curpos = changeCoord(curpos[0],curpos[1],dir)
            }
            else
            {
                turnRight();
                turnRight();
                dir = (dir + 2)%4;
                move(dir)
                curpos = changeCoord(curpos[0],curpos[1],dir)
            }
            // console.log(curpos[0] + "\/"+curpos[1])
   
        }
        // console.log(curpos[0] + "\/"+curpos[1])
        makeEnd(localmap)
        return [curpos,localmap,dir];
    }
    function makeEnd(localmap)
    {
        for (var i=0;i<localmap.length;i++)
        {
            localmap[i][0][0] = 1;
            localmap[i][7][2] = 1;
        }
        for(var j = 0;j<localmap[0].length;j++)
        {
            localmap[0][j][1] = 1;
            localmap[7][j][3] = 1;
        }
    }
    function loaddata()
    {
//      fs = require("fs");
        var height = 120;
        var width = 160;
//      var DataPath = "Задача 2.6\\test_1.txt";
        inp = script.readAll('input.txt');
 
//      var data = np[0];
 
        var data1 = inp[0].split(" ");
        var data2 = inp[1].split(" ");
        var cnt = 0;
        var firstImage = []
        var seconsImage = []
        for( var i = 0; i < height;i++)
        {
            seconsImage.push([])
            firstImage.push([])
            for (var j = 0;j <width;j++)
            {
                seconsImage[i].push([])
                firstImage[i].push([])
 
            }
        }
 
        for( var i = 0; i < height;i++)
        {
 
            for (var j = 0;j <width;j++)
            {
                firstImage[i][j] = grayscale(data1[cnt])
                seconsImage[i][j] = grayscale(data2[cnt])
                cnt++;
            }
        }
        return [firstImage,seconsImage];
    }
    function copyArray(arr)
    {
        var newarr = [];
        for (var bv = 0;bv<arr.length;bv++)
        {
 
            newarr.push(arr[bv]);
           
        }
       
       
       
       
        return newarr;
    }
    function findWay(localmap,posr,posf,dira,dirf)
    {
        function getCommand(dirr,dirw,comands)
        {
            var newdir = dirr;
            var dif = dirr-dirw;
            if (dif>0)
            {
                for (var g = 0;g<Math.abs(dif);g++)
                {
                    comands.push("L");
                    newdir = newdir-1;
                }
            }
            else
            {
                for (var g = 0;g<Math.abs(dif);g++)
                {
                    comands.push("R");
                    newdir = newdir+1;
                }
            }
            if (newdir<0)
            {
                newdir = 4 - Math.abs(newdir);
            }
            else if(newdir>3)
            {
                newdir = newdir-4
            }
            return newdir;
        }
        var massa = []
        var was = []
        massa.push([[posr[0],posr[1],dira],[]])
        var xa,ya,dir;
        var c =0;
        while(massa.length>0)
        {
            var cur = massa.shift();
            was.push(cur)
            xa = cur[0][0];
            ya = cur[0][1];
            dir = cur[0][2];
            // drawNew(localmap,[xa,ya],c,dir);
            c++;
   
            var comanda = cur[1]
            if (posf[0] == xa && posf[1] == ya)
            {
                return comanda
                // break;
            }
            for (var f = 0;f<=3;f++)
            {
                if (localmap[ya][xa][f] == 0)
                {
                    var copy = copyArray(comanda)
                    var cdir = getCommand(dir,f,copy)
                    copy.push("F")
                    var vcx,vcy;
                    if (f == 0)
                    {
                        vcx = xa-1;
                        vcy = ya;
                    }
                    else if (f==1)
                    {
                        vcy = ya-1;
                        vcx = xa;
                    }
                    else if (f == 2)
                    {
                        vcx = xa + 1;
                        vcy = ya;
                    }
                    else if (f==3)
                    {
                        vcy = ya+1;
                        vcx = xa;
                    }
                    var flag = true;
//                  if (vcx == 7 && vcy == 7)
//                  {
//                      console.log("fd")
//                  }
                    for (var ty = 0;ty<was.length;ty++)
                    {
                        if (was[ty][0][0] == vcx && was[ty][0][1] == vcy && copy.length>= was[ty][1].length)
                        {
                            flag = false;
                        }
                    }
                    if(flag)
                    {
                        massa.push([[vcx,vcy,cdir],copy])
                    }
                }
            }
        }
        return comanda
    }
//  function drawNew(maze,curpos,cnt,dir)
//  {
//      var width = 500,height = 500;
//      var canvas = Canvas.createCanvas(width,height)
//      var ctx = canvas.getContext('2d')
//
//      var le = 50
//      for(var i = 0;i<maze.length;i++)
//      {
//          for(var j = 0;j<maze[i].length;j++)
//          {
//              var curx1,cury1;
//              if (maze[i][j][0] == 1)
//              {
//
//                  curx1 = 10 + j*le;
//                  cury1 = 10 + i*le;
//                  ctx.fillRect(curx1,cury1,1,le)
//              }
//              if (maze[i][j][1] == 1)
//              {
//
//                  ctx.fillRect(10 + j*le,10 + i*le,le,1)
//              }
//              if (maze[i][j][2]==1)
//              {
//                  ctx.fillRect(10 + (j+1)*le,10 + i*le,1,le)
//
//              }
//              if (maze[i][j][3] == 1)
//              {
//                  ctx.fillRect(10 + (j)*le,10 + (i+1)*le,le,1)
//              }
//          }
//      }
//      ctx.fill();
//      if (dir ==2)
//      {
//          ctx.beginPath();
//          ctx.moveTo(curpos[0]*le+10 + le/4 ,curpos[1]*le+10+le/4);
//          ctx.lineTo((curpos[0]+1)*le+10 - le/4, curpos[1]*le+10+le/2)
//          ctx.lineTo(curpos[0]*le+10 + le/4 ,(curpos[1]+1)*le+10-le/4)
//          ctx.fill();
//      }
//      else if (dir == 0)
//      {
//          ctx.beginPath();
//          ctx.moveTo((curpos[0]+1)*le+10 - le/4 ,curpos[1]*le+10+le/4);
//          ctx.lineTo(curpos[0]*le+10 + le/4, curpos[1]*le+10+le/2);
//          ctx.lineTo((curpos[0]+1)*le+10 - le/4 ,(curpos[1]+1)*le+10-le/4);
//          ctx.fill();
//      }
//      else if (dir == 1)
//      {
//          ctx.beginPath();
//          ctx.moveTo(curpos[0]*le+10 + le/4 ,(curpos[1]+1)*le+10-le/4);
//          ctx.lineTo(curpos[0]*le+10 + le/2, curpos[1]*le+10+le/4);
//          ctx.lineTo((curpos[0]+1)*le+10 - le/4 ,(curpos[1]+1)*le+10-le/4);
//          ctx.fill();
//      }
//      else
//      {
//          ctx.beginPath();
//          ctx.moveTo(curpos[0]*le+10 + le/4 ,curpos[1]*le+10+le/4);
//          ctx.lineTo(curpos[0]*le+10 + le/2, (curpos[1]+1)*le+10-le/4);
//          ctx.lineTo((curpos[0]+1)*le+10 - le/4 ,curpos[1]*le+10+le/4);
//          ctx.fill();
//      }
//      // ctx.fillRect(curpos[0]*le+10 +le/4,curpos[1]*le+10 + le/4,le/2,le/2)
//      canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, "CPSU"+cnt+".png")))
//  }
function findPass(localmap,posf)
{
    var cur,was,answ;
    var cnt = 0;
    cur = [];
    was = [];
    answ = [];
    cur.push(posf);
    while(cur.length>0)
    {
        var y,x;
        var tmp = cur.shift();
       
        x = tmp[0];
        y = tmp[1];
        was.push([x,y])
        for (var f = 0;f<4;f++)
        {
//            if (x==8 || y == 8)
//            {
//                console.log("fdfsd")
//            }
            if (localmap[y][x][f] == 0)
            {
                var vcx,vcy;
                if (f == 0)
                {
                    vcy = y;
                    vcx = x-1;
                }
                else if (f==1)
                {
                    vcx = x;
                    vcy = y-1;
                }
                else if (f == 2)
                {
                    vcy = y;
                    vcx = x + 1
                }
                else if (f==3)
                {
                    vcx = x;
                    vcy = y+1
                }
//                if (vcx==8 || vcy == 8)
//                {
//                    console.log("fdfsd")
//                }
                answ.push([vcx,vcy,(f+2)%4])
 
            }
            else if (localmap[y][x][f] == -1)
            {
//                if (x==8 || y == 8)
//                {
//                    console.log("fdfsd")
//                }
                var vcx,vcy;
                if (f == 0)
                {
                    vcy = y;
                    vcx = x-1;
                }
                else if (f==1)
                {
                    vcx = x;
                    vcy = y-1;
                }
                else if (f == 2)
                {
                    vcy = y;
                    vcx = x + 1
                }
                else if (f==3)
                {
                    vcy = y+1
                    vcx = x;
                }
                var prova = true;
//                if (vcx==8 || vcy == 8)
//                {
//                    console.log("fdfsd")
//                }
                for (var gh = 0;gh<was.length;gh++)
                {
                    if (vcy == was[gh][1] && vcx == was[gh][0])
                    {
                        prova = false;
                        break;
                    }
                }
                for (var n = 0;n<cur.length;n++)
                {
                    if (vcx == cur[n][0] && vcy == cur[n][1])
                    {
                        prova = false;
                        break;
                    }
                }
                if (prova)
                {
                    cur.push([vcx,vcy])
                }
 
            }
        }
        cnt++;
    }
    return answ
    }
    function proverka(a)
    {
        for (var i = 0;i<a.length;i++)
        {
            if (a[i] == 0)
            {
                return true;
            }
        }
        return false;
    }
    // function drawpic(image,corners,name)
    // {
       
    //     var height = image.length
    //     var width = image[0].length
    //     var canvas = Canvas.createCanvas(width,height)
    //     var ctx = canvas.getContext('2d')
 
 
    //     // var lingrad = ctx.createLinearGradient(0, 0, 0, 150)
    //     // lingrad.addColorStop(0, '#00ABEB')
    //     // lingrad.addColorStop(0.5, '#fff')
    //     // lingrad.addColorStop(0.5, '#26C000')
    //     // lingrad.addColorStop(1, '#fff')
    //     // image[1][0]=0;
 
    //     var imgData = ctx.createImageData(width, height);
    //     var i,x=0,y=0,cnt = 0;
    //     for (var y = 0;y<height;y++)
    //     {
    //         for (var x = 0;x<width;x++)
    //         {
    //             imgData.data[cnt] = image[y][x]
    //             imgData.data[cnt+1] = image[y][x]
    //             imgData.data[cnt+2] = image[y][x]
    //             imgData.data[cnt+3] = 255
    //             cnt = cnt+4
 
    //         }
    //     }
    //     for (var c = 0; c<corners.length;c++)
    //     {
    //         var y1 = corners[c][0]
    //         var x1 = corners[c][1]
    //         var curi = 4*(y1*width+x1)
    //         imgData.data[curi] = 255
    //         imgData.data[curi+1] = 0
    //         imgData.data[curi+2] = 0
 
    //     }
    //     ctx.putImageData(imgData, 0, 0);
    //     // ctx.rect(1, 1, 10, 10);
    //     // ctx.fill()
    //     // var lingrad2 = ctx.createLinearGradient(0, 50, 0, 95)
    //     // lingrad2.addColorStop(0.5, '#000')
    //     // lingrad2.addColorStop(1, 'rgba(0,0,0,0)')
 
    //     // assign gradients to fill and stroke stylesx
    //     // ctx.fillStyle = lingrad
    //     // ctx.strokeStyle = lingrad2
 
    //     // draw shapes
    //     // ctx.fillRect(10, 10, 130, 130)
    //     // ctx.strokeRect(50, 50, 50, 50)
 
    //     canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, name)))
    // }
    function makeFinish()
    {
        brick.display().addLabel("finish",1,1);
    }
			function soup(dirr,dirw,comands)
        {
            var newdir = dirr;
            var dif = dirr-dirw;
            if (dif>0)
            {
                for (var g = 0;g<Math.abs(dif);g++)
                {
//                    comands.push("L");
					turnLeft()
                    newdir = newdir-1;
                }
            }
            else
            {
                for (var g = 0;g<Math.abs(dif);g++)
                {
//                    comands.push("R");
					turnRight()
                    newdir = newdir+1;
                }
            }
            if (newdir<0)
            {
                newdir = 4 - Math.abs(newdir);
            }
            else if(newdir>3)
            {
                newdir = newdir-4
            }
            return newdir;
        }
    function calltowin()
{
    var tmp = mazeGo();
    var pos = tmp[0];
    var localmap = tmp[1];
    var dir = tmp[2];
    // var DataPath = "Задача 2.6\\test_2.txt";
    // var data = fs.readFileSync(DataPath, "utf8").trim().split("\n");
    // var data1 = data[0].split(" ");
    // var data2 = data[1].split(" ");
    var adg = loaddata()
    var firstImage = adg[0]
    var seconsImage = adg[1];
    // drawpic(firstImage,[],"osel.png")
    // drawpic(seconsImage,[],"shrek.png")
   
    var first = countArtag(firstImage,120,160);
    var second = countArtag(seconsImage,120,160);
    var xf,yf
    if (first>7)
    {
        xf = second;
        yf = first - 8;
    }
    else
    {
        xf = first;
        yf  = second - 8
    }
    if (proverka(localmap[yf][xf]))
    {
        var co = findWay(localmap,pos,[xf,yf],dir,-1)
        for (var i = 0;i<co.length;i++)
        {
            var cur;
            cur = co[i];
            if (cur == "F")
            {
                move(dir);
            }
            else if (cur == "L")
            {
                dir = dir-1;
                if (dir == -1)
                {
                    dir = 3;
                }
                turnLeft();
            }
            else if (cur == "R")
            {
                dir = (dir + 1)%4
                turnRight();
            }
        }
        makeFinish()
    }
    else
    {
        function comp(a,b)
        {
            return b[1].length - a[1].length;
        }
        var chect=-1;            
//        drawNew(localmap,[0,0],"pr",0)
 
        while(true)
        {
            // drawNew(localmap,[0,0],chect,0)
            chect++;
            var points = findPass(localmap,[xf,yf]);
            var maxlen = 0;
            var ind =-1;
            for (var t = 0;t<points.length;t++)
            {
               
                var len = findWay(localmap,pos,[points[t][0],points[t][1]],dir,-1);
								
                points[t].push(len);
				
            }
            points.sort(comp)
            var bf = points[0];
			dirfa = bf[2]

            for (var i = 0;i<bf[3].length;i++)
            {
                var cur;
                cur = bf[3][i];
                if (cur == "F")
                {
                    pos = changeCoord(pos[0],pos[1],dir)
                    move(dir);
                }
                else if (cur == "L")
                {
                    dir = dir-1;
                    if (dir==-1)
                    {
                        dir = 3;
                    }
                    turnLeft();
                }
                else if (cur == "R")
                {
                    dir =( dir + 1)%4
                    turnRight();
                }
            }
			dir = soup(dir,dirfa,[]);
            move(dir)
            pos = changeCoord(pos[0],pos[1],dir)
            var x,y;
            x = pos[0];
            y = pos[1];

			var hm = false;
//            dir = bf[2];
            var fl = false;
            var her = 0;
            while(true)
            {
 
                var dim = takeDimension();
//              print(dir," --- ",dim);
                addToLocalMap(localmap,[x,y],dir,dim);
                update(localmap);
//                drawNew(localmap,[x,y],chect+"_"+her,dir);
                her++;
				if (y==yf && x == xf)
				{
					hm = true;
					makeFinish(finish)
					break
				}
                if (proverka(localmap[yf][xf]))
                {
                    fl = true;
                    break;
                }
                // console.log(cnt)
 
                if (dim[2] == 0)
                {
                    turnRight()
                    dir = (dir + 1)%4;
                    move(dir)
                    var m = changeCoord(x,y,dir)
                    x = m[0]
                    y = m[1]
                }
                else if (dim[1] == 0)
                {
                    // turnRight()
                    move(dir)
                    var m =changeCoord(x,y,dir)
                    x = m[0]
                    y = m[1]
 
                }
                else if (dim[0] == 0)
                {
                    turnLeft()
                   
                    dir = dir-1;
                    if (dir ==-1)
                    {
                        dir = 3;
                    }
                    move(dir)
                    var m =changeCoord(x,y,dir)
                    x = m[0]
                    y = m[1]
                }
                else
                {
                    break
                }
            }
            if (fl)
            {
//                console.log("found")
                var co = findWay(localmap,[x,y],[xf,yf],dir,-1)
                for (var i = 0;i<co.length;i++)
                {
                    var cur;
                    cur = co[i];
                    if (cur == "F")
                    {
                        move(dir);
                    }
                    else if (cur == "L")
                    {
                        if (dir == 0)
                        {
                            dir = 3;
                        }
                        else{
                            dir = dir-1;
                        }
                        turnLeft();
                    }
                    else if (cur == "R")
                    {
                        dir = (dir+1)%4;
                        turnRight();
                    }
                }
                // console.log("win")
				

                makeFinish()
                break
            }
			if (hm)
			{
				break;
			}
		
        }
    }
}
    // points.sort(sortPoints);
    // for (var i = 0;i<points.length;i++)
    //
//  var path = require('path')
//  var Canvas = require('canvas')
//  var fs = require("fs")
//  var maze =[[[1, 1, 0, 1], [0, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1]],
//  [[1, 1, 1, 1], [1, 0, 0, 1], [0, 1, 0, 1], [0, 1, 1, 0], [1, 1, 1, 1], [1, 0, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0]],
//  [[1, 1, 0, 0], [0, 1, 1, 0], [1, 1, 1, 1], [1, 0, 0, 0], [0, 1, 0, 1], [0, 0, 1, 0], [1, 0, 1, 1], [1, 0, 1, 1]],
//  [[1, 0, 1, 0], [1, 0, 0, 0], [0, 1, 0, 1], [0, 0, 1, 1], [1, 1, 1, 1], [1, 0, 0, 1], [0, 1, 1, 0], [1, 1, 1, 1]],
//  [[1, 0, 1, 0], [1, 0, 1, 1], [1, 1, 1, 1], [1, 1, 0, 0], [0, 1, 1, 0], [1, 1, 1, 1], [1, 0, 0, 0], [0, 1, 1, 0]],
//  [[1, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 1], [0, 0, 1, 0], [1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1], [1, 0, 1, 0]],
//  [[1, 0, 1, 0], [1, 0, 1, 1], [1, 1, 1, 1], [1, 0, 1, 1], [1, 1, 0, 0], [0, 1, 0, 1], [0, 1, 1, 0], [1, 0, 1, 0]],
//  [[1, 0, 0, 1], [0, 1, 0, 1], [0, 1, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1], [1, 1, 1, 1], [1, 0, 0, 1], [0, 0, 1, 1]]]
//  xnach = 6;
//  ynach = 2;
    try{
    calltowin();
    }
    catch(e)
    {
        makeFinish()
    }
    // }
    // findWay(localmap,pos,[xf,yf],);
 
    return;
}