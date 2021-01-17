var __interpretation_started_timestamp__;
var pi = 3.141592653589793;
var turn_move_kostil = 200

var main = function()
{
	__interpretation_started_timestamp__ = Date.now();
	brick.gyroscope().calibrate(4000);
	script.wait(5000);
//	x=0
//	y=0
//	dir=2
//	xf=3
//	yf=0

	var da = script.readAll("C:\\Projects\\IRS2020\\sim2\\task2_00.txt");
	var data1 = da[0].split(" ");
	var data2 = da[1].split(" ");
	var x = parseInt(data1[0],10);
	var y = parseInt(data1[1],10);
	var dir = parseInt(data1[2],10);
	dir = (dir+1)%4
	var xf = parseInt(data2[0],10);
	var yf = parseInt(data2[1],10);
//

	goFin([x,y],dir,[xf,yf])
	
	return;
}
function turnLeft()
{
    var angle = (brick.gyroscope().read()[6] - 90000) / 1000;
    if (angle < -180)
    {
        angle = 90;
    }
   
    move(turn_move_kostil)
   
    while (brick.gyroscope().read()[6] / 1000 != angle)
    {
        var delta = angle - brick.gyroscope().read()[6] / 1000;
        brick.motor(M3).setPower(-5 * delta);
        brick.motor(M4).setPower(5 * delta);
        if (-1 < delta && delta < 1)
        {
            break;
        }
        script.wait(10);
    }
   
    move_back(-turn_move_kostil)
 
    brick.motor(M3).setPower(0);
    brick.motor(M4).setPower(0);
    script.wait(100);
}
 
function turnRight()
{
    var angle = (brick.gyroscope().read()[6] + 90000) / 1000;
    if (angle > 180)
    {
        angle = -90;
    }
   
    move(turn_move_kostil)
   
    while (brick.gyroscope().read()[6] / 1000 != angle)
    {
        var delta = angle - brick.gyroscope().read()[6] / 1000;
        brick.motor(M3).setPower(-5 * delta);
        brick.motor(M4).setPower(5 * delta);
        if (-1 < delta && delta < 1)
        {
            break;
        }
        script.wait(10);
    }
 
    move_back(-turn_move_kostil)
   
    brick.motor(M3).setPower(0);
    brick.motor(M4).setPower(0);
    script.wait(100);
}
 
function move(dist)
{
    if (dist == undefined)
        dist = 1450
   
    brick.encoder(E3).reset();
    brick.encoder(E4).reset();
    while (brick.sensor(D1).read() > 30 && brick.encoder(E3).read() < dist)
    {
        delta = brick.encoder(E3).read() - brick.encoder(E4).read();
        brick.motor(M3).setPower(75 - delta);
        brick.motor(M4).setPower(75 + delta);
        script.wait(10);
    }
   
    brick.motor(M3).setPower(0);
    brick.motor(M4).setPower(0);
    script.wait(100);
}
 
function move_back(dist)
{
    if (dist == undefined)
        dist = -1450
   
    brick.encoder(E3).reset();
    brick.encoder(E4).reset();
    while (brick.encoder(E3).read() > dist)
    {
        delta = -brick.encoder(E3).read() + brick.encoder(E4).read();
        brick.motor(M3).setPower(-75 + delta);
        brick.motor(M4).setPower(-75 - delta);
        script.wait(10);
    }
   
    brick.motor(M3).setPower(0);
    brick.motor(M4).setPower(0);
    script.wait(100);
}
// matr = [[1, 0, 0, 0, 1, 1], [0, 0, 1, 0, 0, 0], [0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 1, 0], [1, 0, 1, 1, 1, 0]]
var takeDimension = function()
{
	var mas = [0, 0, 0, 0]
	if (brick.sensor(A2).read() < 50)
		mas[0] = 1;
	if (brick.sensor(D1).read() < 50)
		mas[1] = 1;
	if (brick.sensor(A1).read() < 50)
		mas[2] = 1;
	if (brick.sensor(D2).read() < 50)
		mas[3] = 1;
	return mas;
}
function makeFinish()
{
	brick.display().addLabel("finish",1,1);
	brick.display().redraw();
	
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
function goFin(pos,dir,posf)
{

	var localmap =[]
	curx = 0;
	cury = 0;
    for (var i = 0; i < 8; i++)
    {
        localmap.push([])
        for (var j = 0; j < 8; j++)
        {
            localmap[i].push([-1,-1,-1,-1])
        }
    }
    for (var i = 0; i < 8; i++)
    {
        localmap[i][0][0] = 1;
		localmap[i][7][2] = 1;
		localmap[0][i][1] = 1;
		localmap[7][i][3] = 1;
    }
//	var tmo = takeDimension();
	var tmol = dir-1;
	var tmor = dir+1;
	var tmon = (dir+2)%4;
	if (dir == 3)
	{
		tmor = 0;
	}
	else if (dir == 0)
	{
		tmol = 3
	}
//	localmap[pos[1]][pos[0]][tmol] = tmo[0];
//	localmap[pos[1]][pos[0]][tmor] = tmo[2];
//	localmap[pos[1]][pos[0]][dir] = tmo[1];
//	addmap(localmap,pos,dir,tmo)
	// drawNew(maze,[x,y],"_sup",2)
	var cnt = 0;
	while(true)
	{
		var tmo = takeDimension();
//		print(tmo);
        addmap(localmap,pos,dir,tmo);
		// curpos = addToLocalMap(localmap,statemap,curpos,dir,pokaz)
		// drawNew(localmap,curpos,cnt,dir)
		if (localmap.length>1 && localmap[0].length>1)
		{
			update(localmap)

        }
        var coms;
        var fl = false;
        if (proverka(localmap[posf[1]][posf[0]]))
        {
            fl = true;
            coms = findWay(localmap,pos,posf,dir)
        }
        else
        {
            coms = findNewWays(localmap,pos,posf,dir)
//			print(coms);
        }
        for (var re = 0; re<coms.length; re++)
        {
			tmo = takeDimension();
			addmap(localmap,pos,dir,tmo);

				
            if (coms[re]=="F")
            {
                move()
                var pos = changeCoord(pos[0],pos[1],dir)
            }
            else if (coms[re] == "L")
            {
                turnLeft();
                dir = dir-1;
                if (dir==-1)
                {
                    dir=3;
                }
                
            }
            else if (coms[re] == "R")
            {
                turnRight();
                dir = (dir+1)%4;

            }
            var tmol = dir-1;
            var tmor = dir+1;
        }
        if (fl)
        {
            break
        }

    }
    makeFinish()
	// console.log(curpos[0] + "\/"+curpos[1])
}
function addmap(localmap,pos,dir,pokaz)
{
    var dirl,dirp,dirn;
    dirp = (dir+1)%4;
    dirl = dir-1;
	dirn = (dir+2)%4;
    if (dirl == -1)
    {
        dirl = 3
    }
    localmap[pos[1]][pos[0]][dirl] = pokaz[0];
    localmap[pos[1]][pos[0]][dirp] = pokaz[2];
    localmap[pos[1]][pos[0]][dir] = pokaz[1];
	localmap[pos[1]][pos[0]][dirn] = pokaz[3];


}
function findNewWays(localmap,pos,posf,dir)
{
//    var maxdist = Math.abs(pos[0] - posf[0]) + Math.abs(pos[1] - posf[1])
    var mindDist = 100;
	var poro = []
    for (var ic = 0; ic<localmap.length; ic++)
    {
        for (var jc = 0; jc<localmap[0].length; jc++)
        {
			if (ic == pos[1] && jc == pos[0])
			{
				continue
			}
            var unkno = false;
            var podo = false;
            for (var cnt = 0; cnt<4; cnt++)
            {
                if (localmap[ic][jc][cnt] == -1)
                {
                    unkno = true;
                }
                if (localmap[ic][jc][cnt] == 0)
                {
                    podo = true;
                }
            }
//			if (ic == 6 && jc == 4)
//			{
//				print()
//			}
            if (unkno && podo)
            {
                var locdist = Math.abs(ic-posf[1]) + Math.abs(jc - posf[0])

                if (locdist<mindDist)
                {
                    mindDist = locdist;
                    poro =[];
					poro.push([jc,ic]);
                }
				else if (locdist == mindDist)
				{
					poro.push([jc,ic])
				}
            }
        }
    }
	var mincoms = [];
	var oke = true;
	for (var fe = 0; fe < poro.length; fe++)
	{
		var comands = findWay(localmap,pos,poro[fe],dir)
		if (oke)
		{
			mincoms = copyArray(comands);
			oke = false
		}
		else if (mincoms.length<comands.length)
		{
			mincoms = copyArray(comands);
		}

	}

    return mincoms;
}
function findWay(localmap,posr,posf,dira)
{
    function getCommand(dirr,dirw,comands)
    {
        var newdir = dirr;
        var dif = dirr-dirw;
		if (dif == -3)
		{
			comands.push("L");
			newdir = newdir-1;
		}
		else if (dif == 3)
		{
			comands.push("R");
			newdir = newdir+1;
		}
        else if (dif>0)
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
            // if (dirf != -1)
            // {
            //     cdir = getCommand(dira,dirf,comanda);

            // }
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
                var vcx = -1;
				var vcy = -1;
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
//					if (vcx == 7 && vcy == 7)
//					{
//						console.log("fd")
//					}
				if (vcx == -1 || vcy == -1 || vcx == 8 || vcy == 8)
				{
					flag = false;
				}
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


function copyArray(arr)
{
	var newarr = [];
	for (var bv = 0;bv<arr.length;bv++)
	{

		newarr.push(arr[bv]);
		
	}
	return newarr;
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