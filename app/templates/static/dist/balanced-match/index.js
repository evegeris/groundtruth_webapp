function balanced(e,n,a){e instanceof RegExp&&(e=maybeMatch(e,a)),n instanceof RegExp&&(n=maybeMatch(n,a));var t=range(e,n,a);return t&&{start:t[0],end:t[1],pre:a.slice(0,t[0]),body:a.slice(t[0]+e.length,t[1]),post:a.slice(t[1]+n.length)}}function maybeMatch(e,n){var a=n.match(e);return a?a[0]:null}function range(e,n,a){var t,r,c,l,i,o=a.indexOf(e),f=a.indexOf(n,o+1),g=o;if(o>=0&&f>0){for(t=[],c=a.length;g>=0&&!i;)g==o?(t.push(g),o=a.indexOf(e,g+1)):1==t.length?i=[t.pop(),f]:(r=t.pop(),r<c&&(c=r,l=f),f=a.indexOf(n,g+1)),g=o<f&&o>=0?o:f;t.length&&(i=[c,l])}return i}module.exports=balanced,balanced.range=range;