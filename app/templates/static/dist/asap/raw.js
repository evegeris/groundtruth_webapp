"use strict";function rawAsap(e){queue.length||(requestFlush(),flushing=!0),queue[queue.length]=e}function flush(){for(;index<queue.length;){var e=index;if(index+=1,queue[e].call(),index>capacity){for(var u=0,i=queue.length-index;u<i;u++)queue[u]=queue[u+index];queue.length-=index,index=0}}queue.length=0,index=0,flushing=!1}function requestFlush(){var e=process.domain;e&&(domain||(domain=require("domain")),domain.active=process.domain=null),flushing&&hasSetImmediate?setImmediate(flush):process.nextTick(flush),e&&(domain.active=process.domain=e)}var domain,hasSetImmediate="function"==typeof setImmediate;module.exports=rawAsap;var queue=[],flushing=!1,index=0,capacity=1024;rawAsap.requestFlush=requestFlush;