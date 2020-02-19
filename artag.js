
function countArtag(image,height,width)
{
    function grayscale(rgb) {
        try{
        m = rgb.trim();
        return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
        }
        catch(e)
        {
            console.log("kapec")
        }
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
        //напишу пойзже, если попаду на финал
        for (var  i = 2; i < height-2;i++)
        {
            for(var j = 2;j<width-2;j++)
            {
                var sums = image[i-2][j-2] + image[i-2][j-1]*4 + image[i-2][j]*7 + image[i-2][j+1] * 4 + image[i-2][j+2] + image[i-1][j-2]*4 + image[i-1][j-1]*16 + image[i-1][j]*26 + image[i-1][j+1] * 16 + image[i-1][j+2] * 4;
                sums = sums+ image[i+2][j-2] + image[i+2][j-1]*4 + image[i+2][j]*7 + image[i+2][j+1] * 4 + image[i+2][j+2] + image[i+1][j-2]*4 + image[i+1][j-1]*16 + image[i+1][j]*26 + image[i+1][j+1] * 16 + image[i+1][j+2] * 4;
                sums = sums + 7*image[i][j-2] + 26*image[i][j-1] + 41*image[i][j] + 26*image[i][j+1] + 7*image[i][j+2]
                nearr[i][j] = sums/273
            }

        }
        return nearr;
    }
    function countDifference(cur,nuclear,t=1)
    {
        if (cur >70)
        {
            return 0
        }
        else
        {
            return 1;
        }
        if (cur - nuclear>t)
        {
            return 0;
        }
        else{
            return 1;
        }
        tmp = Math.pow((cur-nuclear)/t,6)
        c = Math.exp(-tmp);
        return c;
    }
    function findCorners(image,rad,g,k)
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
                if (i == 78 && j == 154)
                {
                    console.log("fdsf")
                }
                for (var c = i-rad;c<=i+rad;c++)
                {
                    for (var d = j - rad;d<=j+rad;d++)
                    {
                        nsum = nsum + countDifference(image[c][d],image[i][j],k)
                    }
                }
                if (nsum<g && nsum>32)
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

        // let corner=centroid(cornerimage,rad)
        return corners

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
        // let indexes = []
        // let newcorners = []
        // for (var i = 0; i < corners.length;i++)
        // {
        //     if (i in indexes)
        //     {
        //         continue
        //     }
        //     let neighbors = []
        //     neighbors.push(corners[i]);
        //     indexes.push(i);
        //     for (var j = i+1;j<corners.length;j++)
        //     {
        //         if (j in indexes)
        //         {
        //             continue
        //         }
        //         if (Math.sqrt( Math.pow(corners[i][0]-corners[j][0],2) + Math.pow(corners[i][0]-corners[j][0],2) )<5)
        //         {
        //             indexes.push(j)
        //             neighbors.push(corners[j])
        //         }
        //     }
        //     var x=0,y=0;
        //     for (var d = 0;d<neighbors.length;d++)
        //     {
        //         x = x + neighbors[d][0]
        //         y = y + neighbors[d][1]
        //     }
        //     x = Math.round(x / neighbors.length);
        //     y = Math.round(y / neighbors.length);
        //     newcorners.push([x,y])
        // }
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
    function findBorders(image,corners,gPorog,ex = 10)
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
        let bs = lines.slice(0,4);
        let data = [];
        data.push([bs[0][0],bs[0][1]])
        var curs = [bs[0][2],bs[0][3]]
        data.push([bs[0][2],bs[0][3]])
        bs.shift();
        while(bs.length>0)
        {
            for (var i = 0; i < bs.length;i++)
            {
                
            }
        }
        // tmp.push(bs[0])

        // while(tmp.length>0)
        // {
        //     var s = false
        //     var cur = tmp.shift()
        //     data.push([cur[0],cur[1]])
        //     for (var i = 0;i<bs.length;i++)
        //     {
        //         if (data.length>3)
        //         {
        //             s = true;
        //             break;
        //         }
        //         // if (bs[i][0] == cur[2] && bs[i][1] == cur[3])
        //         // {
        //         //     tmp.push(bs[i])
        //         // }
        //         if ((Math.abs(bs[i][0]-cur[2]) <ex && Math.abs(bs[i][1]-cur[3]) <ex) || (Math.abs(bs[i][0]-cur[0]) <ex && Math.abs(bs[i][1]-cur[1]) <ex))
        //         {
        //             tmp.push(bs[i])

        //         }
        //     }
        //     if (s)
        //     {
        //         break
        //     }
        // }
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
    function artagMatrix(corners,image,num_cells)
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
        cornerData.sort(compare)
        let matrix = []
        for (var i = 0;i<num_cells;i++)
        {
            matrix.push([])
            for (var j = 0;j<num_cells;j++)
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
            if (matrix[num_cells-1][num_cells-1]==0){
                flags = true
                break;
            }
            else{
                matrix = rotateMatrix(matrix);
            }
        }
        if (flags)
        {
            return countValue(matrix); 
        }
        else
        {
            return -1
        }
    }
    function countValue(matrix)
    {
        return matrix[0][1]*8+matrix[1][0]*4 + matrix[1][2]*2 + matrix[2][1]   
    }
    let near = image
    let corn = findCorners(near,5,35,6)
    drawNew(near,corn,"god_help_u.png")
    // let bord = findBorders(image,corn,0.6)
    // var zn = artagMatrix(bord,image,3)
    var zn = -1
    return zn
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
    canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, name)))
    return 0
}
function grayscale(rgb) {
    try{
    m = rgb.trim();
    return (parseInt(m.substr(0,2),16)*0.299 + parseInt(m.substr(2,2),16)*0.587 + parseInt(m.substr(4,2),16)*0.114);
    }
    catch(e)
    {
        return -1
    }
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
    for( var i = 0; i < height;i++)
    {

        for (var j = 0;j <width;j++)
        {
            
            firstImage[i][j] = grayscale(data[cnt])
            cnt++;
        }
    }
    drawNew(firstImage,[],"putin_krab.png")
    return firstImage;
}
height = 330
width = 350
DataPath = "test_in_text1.txt"
let firstImage = []
// let seconsImage = []

fs = require("fs");

let data = fs.readFileSync(DataPath, "utf8").trim();

let data1 = data.split(",")
firstImage = loaddata(data1,height,width)

var first = countArtag(firstImage,height,width)
console.log(first)

