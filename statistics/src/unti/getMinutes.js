const formatDuring=(s)=> {
    var h;
    h  =   Math.floor(s/60);
    s  =   s%60;
    h    +=    '';
    s    +=    '';
    h  =   (h.length==1)?'0'+h:h;
    s  =   (s.length==1)?'0'+s:s;
    return h+':'+s;
}

export default formatDuring;