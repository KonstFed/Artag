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
function hammingPureDecode(input) {


	var controlBitsIndexes = [];
	var l = input.length;
	var originCode = input;
	var hasError = false;
	var inputFixed, i;
	
	i = 1;
	while (l / i >= 1) {
		controlBitsIndexes.push(i);
		i *= 2;
	}

	controlBitsIndexes.forEach(function (key, index) {
		originCode = originCode.substring(0, key - 1 - index) + originCode.substring(key - index);
	});

	return originCode;
}
function decode2(matr)
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

  
  var sa = hammingPureDecode(rigt.join("")).split("")

    // var sd = []
    // for (var j = 0; j < rigt.length; j++)
    // {
    //     var dert = true;
    //     for (var dm = 0; dm<pass.length; dm++)
    //     {
    //         if(j == pass[dm])
    //         {
    //             dert = false;
    //             break;
    //         }
    //     }
    //     if (dert)
    //     {
    //       sd.push(rigt[j])
    //     }
    // }//[
  var comands = []
  for (var sr = 0; sr<13  ; sr++)
  {
    var zn = parseInt(sa[sr*2])*2 + parseInt(sa[sr*2+1])
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
function decode1(matr)
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
  s = rigt
  cl = [0,1,3,7,15,31];
     
    cb = [0,0,0,0,0,0];
    if ((s[2]+s[4]+s[6]+s[8]+s[10]+s[12]+s[14]+s[16]+s[18]+s[20]+s[22]+s[24]+s[26]+s[28]+s[30])%2!=0)
        cb[0] = 1
    if ((s[2]+s[5]+s[6]+s[9]+s[10]+s[13]+s[14]+s[17]+s[18]+s[21]+s[22]+s[25]+s[26]+s[28]+s[31])%2!=0)
        cb[1] = 1;
    if ((s[4]+s[5]+s[6]+s[11]+s[12]+s[13]+s[14]+s[19]+s[20]+s[21]+s[22]+s[27]+s[28]+s[29]+s[30])%2!=0)
        cb[2] = 1;
    if ((s[7]+s[15]+s[23]+s[31])%2!=0)
        cb[3] = 1;
    if ((s[15]+s[31])%2!=0)
        cb[4] = 1;
    if (s[31]%2!=0)
        cb[5] = 1;
    eb = 0;
    for(var i = 0; i<6; i++){
        if (cb[i]!=s[cl[i]])
            eb+=i+1 ;
    }
    if (eb<32){
        s[eb-1] = Math.abs(s[eb-1]-1);
    }  
    //print(s)
    s.splice(0, 1)
    s.splice(0, 1)
    s.splice(1, 1)
    s.splice(4, 1)  
    s.splice(10, 1)
    s.splice(25, 1)  
    //s = s.reverse();
   
    s = s.join("");
    s = s.match(/.{1,2}/g);
    res = []
    for (var i = 0; i < s.length; i++){
        res.push(parseInt(s[i], 2 ));
    }
   
    return res;
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
matr = [[0,1,1,1,1,0],[1,1,1,0,0,1],[0,1,1,0,0,0],[1,1,0,0,0,1],[1,0,0,1,0,0],[0,0,0,0,0,1]]
mare2 = [[0,0,1,1,1,0],[1,0,0,1,1,0],[1,1,1,1,1,0],[0,1,0,1,1,0],[0,1,0,1,1,0],[0,0,0,0,0,1]]
kavo = decode(mare2)
//3 3 1 1 2 1 3 0 3 0 2 0 0
console.log(kavo)