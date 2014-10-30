+function( window ) {

// Class for calculation
// by Roman Zhak
// 

function Estimation( _w, _r, weight ) {

    this.object         = {};
    this.arrays         = [];
    this.arraysWithSums = [];
    this.Weight         = weight || 0;
    this.w      = (_w instanceof Array ? _w : [])      // weight of each item
    this.r      = (_r instanceof Array ? _r : [])      // profit from shipping operations
    var
      steps = this.w.length - 1                        // counts the steps in this algorithm
    , i = 0
    , integer;                                         // define max M1,M2,M3,...,Mn -> [Weight/w]

                                                       // Model of function: f(x) = max{ r*m + Fi+1(Xi - mw)} 
  
  //w.push(0); r.push(0);
  
  for( var p = steps ; i < steps; i++, p-- ) {
	this.object[i] = {}; // to store
	integer = Math.floor( this.Weight / this.w[p - 1] );
	this.arrays.push([]);
  this.arraysWithSums.push([])
	 for( var j = integer, L = this.Weight, state = 0; L >= 0; j--, state++, L-- ){
		this.arrays[i].push([]);
    this.arraysWithSums[i].push([])
		var m = 0, expression, $;
          do {
             $ = ( i > 0  ? this.object[i - 1][(state - m * this.w[p - 1]).toString()] : 0 );
             // devide to sums
               var first  =  ( m * this.w[p - 1] <= state ? this.r[p - 1] * m : null )
               var second =  ( typeof $ === 'object' ? $[0] : $ );
                expression = (m * this.w[p - 1] <= state ? this.r[p - 1] * m + second : null );
             //
             
             this.arraysWithSums[i][state].push([first, second].join('+'))
             this.arrays[i][state].push( expression );  
             m++;
          } while( m <= integer );
	    } 
	    this.createIndexRange( this.arrays[i], i )
      if( i === (steps - 1)) this.maxProfit = this.object[i][state - 1][0];
    };

  };


  Estimation.prototype.createIndexRange = function( table, i ){
   var save;
	  for( var _i = 0; _i < table.length; _i++){
      save = Math.max.apply( Math, table[_i] );
		 this.object[i][_i] = [ save, this.position(table[_i], save) ]	  
    }
      return this;
  };
  
  Estimation.prototype.position = function( array, value ){
   var i = 0;
    for( ; i < array.length; i = i + 1) 
       if( array[i] === value ) return i;
  };

  Estimation.prototype.solution = function(){
   var result = [], rest = this.Weight;
   for( var i = this.arrays.length - 1, k = 0; i >= 0; i--, k++){
      var $that = this.object[i];
        for( var j = Object.keys($that).length - 1; j >= 0; j-- ){
          if ($that[j][0] === this.maxProfit && $that[j][1] !== 0){ 

            result.push($that[j][1])
            rest = this.Weight - $that[j][1] * this.w[k];
            continue; 
          }else {
             if(  rest === 0 ) continue;
             if( $that[j][1] * this.w[k] === rest ) 
               result.push($that[j][1]); 
          }
      }
      if( result.length !== k + 1 ) result.push(0);
   }
    return result;
  };

  Estimation.prototype.draw = function( on ){
  var fragment = document.createDocumentFragment(), len = this.arrays.length;
    for( var i = 0 , f = len; i < len; i++, f-- ){
     var temple = document.createElement('div'), interim = this.arraysWithSums[i], html = '<table cellpadding=5 style="width: 99%;">';
         temple.className = 'calculation';
              html += '<h3>Этап <b>' + f + '</b>: f(x<sub>' + f +'</sub>) = max{' + this.r[f - 1] + 'm<sub>' + f + '</sub> + ' +
                       (i === 0 ? '0' :  'f<sub>' + (f+1) +'</sub>(x<sub>' + f +'</sub> - ' + this.w[f-1]  +'m<sub>' + f +'</sub>)'  )  + '} \
                       при <b>Max</b> m<sub>' + f +'</sub> = [' + this.Weight + '/' + this.w[f - 1] + '] = ' + Math.floor( this.Weight / this.w[f - 1]) + ' </h3>'
              html += '<tr><td align="center" width="50px" class="clips"><b>X</b></td>'
              this.arraysWithSums[i][i].forEach(function(element, index){
                 html += '<td align="center"><b>m</b><sub>' + f + '</sub>= ' + index + '</td>';  
              })
              html += '<td align="center" width="50px">f(x)</td><td align="center" width="50px"><b>m</b><sub>' + f + '</sub></td><tr/><tr>'
        for( var j = 0; j < interim.length; j++) {
           var _interim = interim[j], $this, k = 0;
           html += '<td align="center" width="50px" class="clips">' + j + '</td>';
          while( k < _interim.length  ){
			       $this = _interim[k]; 
		         html += '<td align="center">' + ( $this || $this === 0 ? $this : '-' ) + '</td>';
             k = k + 1;
          }
              html += '<td align="center" class="bg">' + this.object[i][j][0] + '</td>' +
                      '<td align="center" class="bg">' + this.object[i][j][1] + '</td></tr>';
      }
        html += '</table>' 
           
        temple.innerHTML = html;
        fragment.appendChild( temple )
    }
    temple = document.createElement('div')
    temple.innerHTML = '<button style="float: right;" onclick="window.print();return false;">Напечатать</button> <h3>Ответ:</h3> <div class="result"> При заданной грузоподъёмности W = ' + this.Weight + ' оптимальным решением \
         является <b>(' + this.solution().join(' , ') + ')</b>, максимальная прибыль равна <b>' + this.maxProfit + '$</b>.'
     fragment.appendChild( temple )
     on.appendChild( fragment );
       setTimeout(function(){
          $(document).scrollTop( $(document).height() );
        }, 250)  
  };
window.Estimation = Estimation;

}( window );
