
function countArtag(image,height = 160,width = 120)
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
    function countDifference(cur,nuclear,t=1)
    {
        tmp = Math.pow((cur-nuclear)/t,6)
        c = Math.exp(-tmp);
        return c;
    }
    function findCorners(image,rad,g)
    {
        // image[1][2]=0;
        let cornerimage = []
        for (var i = 0;i<image.length;i++)
        {
            cornerimage.push([])
            for (var j = 0;j<image[0].length;j++)
            {
                cornerimage[i].push(image[i][j])
            }
        }

        let corners = []
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
        // cornerimage[150][2]=0;

        let corner=centroid(cornerimage,rad)
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
                    let current = [[i,j]]
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
        // if (lenv<40) return 0;
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
        let lines = []
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
        // for (var i = 1;i<4;i++)
        // {
        //     var y1,x1,y2,x2;
        //     y1 = lines[i][0];
        //     x1 = lines[i][1];
        //     y2 = lines[i][2];
        //     x2 = lines[i][3];
        //     let dr = [[y1,x1],[y2,x2]];

        // }
        let data = []

        let bs = lines.slice(0,4);
        let tmp = [];
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
        if (img == undefined)
        {
            console.log("wfdssdsfwqsa")
        }
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

    function artag_matrix(points,img,bias = 6)
    {
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
        difx = Math.max((Math.abs(points.p3.x - points.p1.x)+Math.abs(points.p2.x - points.p4.x)))/(bias-1);
        difx = difx/2
        dify = Math.max((Math.abs(points.p3.y - points.p1.y)+Math.abs(points.p2.y-points.p4.y)))/(bias-1);
        dify /= 2
        // difx = (Math.max(points.p1.x,points.p2.x,points.p3.x,points.p4.x)-Math.min(points.p1.x,points.p2.x,points.p3.x,points.p4.x))/bias
        // dify =  (Math.max(points.p1.y,points.p2.y,points.p3.y,points.p4.y)-Math.min(points.p1.y,points.p2.y,points.p3.y,points.p4.y))/bias
        matrix = []
        r = 0;
        p1x = Math.min(points.p1.x,points.p3.x);
        p3x = Math.max(points.p1.x,points.p3.x);
        p1y = Math.min(points.p1.y,points.p3.y);
        p3y = Math.max(points.p1.y,points.p3.y);
        
        for (var i = 0;i<3;i++)
        {
            matrix.push([])
            var row = p1y + (i+1)*dify
            var sl = difx+p1x;

            for (var j = 0;j<3;j++)
            {
                var col = p1x + (j+1)*difx
                if (isBlackCage({x:col,y:row},{x:col+difx,y:row+dify},img))
                {
                    matrix[r].push(1);
                }
                else{
                    matrix[r].push(0);
                }

            }
            // drawNew(image,[[Math.round(row),Math.round(sl)],[Math.round(row),Math.round(col+difx)]],r+"out.png")

            r++
        }

        // for (var row = dify+p1y;row<p3y-2*dify;row += dify)
        // {
        //     matrix.push([])
        //     var sl = difx*2+p1x;
        //     for (var col = difx + p1x; col <p3x-2*difx; col += difx)
        //     {
                
        //         if (isBlackCage({x:col,y:row},{x:col+difx,y:row+dify},img))
        //         {
        //             matrix[r].push(1);
        //         }
        //         else{
        //             matrix[r].push(0);
        //         }
        //     }

        //     r++;
        // }
        flags = false
        for (c = 0; c<4;c++)
        {
            if (matrix[bias-4][bias-4]==0){
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
            // var n1 = answ[2]+""+answ[4];
            // var x1 = answ[5] + "" + answ[6] + "" + answ[8];
            // var y1 = answ[9] + "" + answ[10] + "" + answ[11];
            var znach = matrix[0][1]*8+matrix[1][0]*4 + matrix[1][2]*2 + matrix[2][1]
            return znach
            // return({n:parseInt(n1,2),x: parseInt(x,2),y:parseInt(y,2)})
        }
        else
        {
            return -1
        }

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
        let lines = [];
        let ind = [];
        let verx = []
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
                let tmp = countcoef(x1,y1,x2,y2)
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
        let cornerData = []
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
        for (var c = 0;c<4;c++)
        {
            drawNew(image,cornerData[c],c+"_saintHappiness.png")

        }
        cornerData.sort(compare)
        let matrix = []
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
    let corn = findCorners(image,2,12)
    let bord = findBorders(image,corn,0.6)
    drawNew(image,bord,"ineedhelp.png")
    var dict = {p1:{y:bord[0][0],x:bord[0][1]},p2:{y:bord[1][0],x:bord[1][1]},p3:{y:bord[2][0],x:bord[2][1]},p4:{y:bord[3][0],x:bord[3][1]}}
    // return artag_matrix(dict,image,6)
    var zn = artagMatrix(bord,image)
    return zn
}

function grayscale(rgb) {
    m = rgb.trim();
    return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
}
height = 120
width = 160
DataPath = "Задача 2.6\\test_2.txt"
let firstImage = []
let seconsImage = []

fs = require("fs");

let data = fs.readFileSync(DataPath, "utf8").trim().split("\n");

let data1 = data[0].split(" ")
let data2 = data[1].split(" ")
var cnt = 0;
for( var i = 0; i < height;i++)
{
    firstImage.push([])
    seconsImage.push([])
    for (var j = 0;j <width;j++)
    {

        firstImage[i].push("")
        seconsImage[i].push("")

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
var path = require('path')
var Canvas = require('canvas')


function drawNew(image,corners,name)
{
    var height = image.length
    var width = image[0].length
    var canvas = Canvas.createCanvas(width,height)
    var ctx = canvas.getContext('2d')


    // var lingrad = ctx.createLinearGradient(0, 0, 0, 150)
    // lingrad.addColorStop(0, '#00ABEB')
    // lingrad.addColorStop(0.5, '#fff')
    // lingrad.addColorStop(0.5, '#26C000')
    // lingrad.addColorStop(1, '#fff')
    // image[1][0]=0;

    var imgData = ctx.createImageData(width, height);
    var i,x=0,y=0,cnt = 0;
    for (var y = 0;y<height;y++)
    {
        for (var x = 0;x<width;x++)
        {
            imgData.data[cnt] = image[y][x]
            imgData.data[cnt+1] = image[y][x]
            imgData.data[cnt+2] = image[y][x]
            imgData.data[cnt+3] = 255
            cnt = cnt+4

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
    // ctx.rect(1, 1, 10, 10);
    // ctx.fill()
    // var lingrad2 = ctx.createLinearGradient(0, 50, 0, 95)
    // lingrad2.addColorStop(0.5, '#000')
    // lingrad2.addColorStop(1, 'rgba(0,0,0,0)')

    // assign gradients to fill and stroke stylesx
    // ctx.fillStyle = lingrad
    // ctx.strokeStyle = lingrad2

    // draw shapes
    // ctx.fillRect(10, 10, 130, 130)
    // ctx.strokeRect(50, 50, 50, 50)

    canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, name)))
}
var first = countArtag(firstImage)
var second = countArtag(seconsImage)
// var second = countArtag(seconsImage)
console.log(first)
console.log(second)
// console.log(first + "//\\"+second )