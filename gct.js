function main(){ 
   
   let new_node = document.querySelector("#newnode");
   let new_edge = document.querySelector("#newedge");
   let send_node = document.querySelector("#send_node");
   let screen_con = document.querySelector("#screen_con");
   let body = document.querySelector("body");
   let node_list = new Map(), edges = [];
   let per = screen_con.offsetWidth * 90 / 100;
   let adlist = document.querySelector("#adlist");
   
   screen_con.innerHTML = "<canvas class=screen width=" + per + "px" + " height=400px></canvas>"
   let screen = screen_con.firstChild;
   let canvas = screen.getContext("2d");
   let pos = screen.getBoundingClientRect();
   let pery = pos.top + 1;
   let perx = pos.left + 1;
   let pcx, pcy, val_width = "2", t = "40px";
    
   if(body.offsetWidth > 600){
       val_width = "3";
       t = "48px";
   }

   function draw_circle(canvas, cx, cy, r, color){
       canvas.beginPath();
       canvas.globalAlpha = "1";
       canvas.arc(cx, cy, r, Math.PI * 2, false);
       canvas.fill();
       canvas.lineWidth = val_width;
       canvas.strokeStyle = color;
       canvas.beginPath();
       canvas.globalAlpha = "1";
       canvas.arc(cx, cy, r + 1, Math.PI * 2, false);
       canvas.stroke();
   }
   function create_node(node_name){
        if(node_list[node_name]){
            let nd = document.getElementById(node_name)
            let ndf = nd.firstChild;
            let canvas2 = ndf.getContext('2d');
            draw_circle(canvas2, pcx, pcy, rc, "gray");
            return;
        }
       
        let node = document.createElement('div');
        let numlab = document.createElement('h1');
        let body = document.getElementsByTagName('body')[0]; 
        let pos, inix, iniy;
        
        node.innerHTML = "<canvas class=nodeform width="+t+" height="+t+"></canvas>"; 
        
        let lx = perx + 50, rx = screen_con.offsetWidth - perx - 50;
        let ly = pery + 50, ry = screen_con.offsetHeight - pery - 50;
        let picked = 0; 
        
        node.style.left = rand(lx, rx) + "px";
        node.style.top = rand(ly, ry) + "px";
        node.className = "node";
        node.id = node_name;
        node_list[node_name] = 1;
        numlab.className = "node_number";
        numlab.textContent = node_name;
        node.appendChild(numlab);
        body.appendChild(node);
        
        pcx = node.offsetWidth / 2, pcy = node.offsetHeight / 2, rc = pcx - 5;
        let nodeform = node.firstChild;
        let canvas2 = nodeform.getContext('2d'); 
        draw_circle(canvas2, pcx, pcy, rc, "gray");
        
        function select(){
            canvas2.clearRect(0, 0, 50, 50);
            draw_circle(canvas2, pcx, pcy, rc, "limegreen");
        }
        function unselect(){
            canvas2.clearRect(0, 0, 50, 50);
            draw_circle(canvas2, pcx, pcy, rc, "gray");
        } 
       
        function pick(e){
           if(picked){
               return;
           }
           picked = 1;
           pos = node.getBoundingClientRect();
           inix = (e.clientX - pos.left);
           iniy = (e.clientY - pos.top);
      
           node.removeEventListener("click", pick);
           select();
           document.addEventListener("click", move);
        }
       function inside(x, y){
           let pos = screen.getBoundingClientRect();
           let xp = pos.left, yp = pos.top;
           let tp = [-1, -1];
           
           if(x > xp + inix && x < xp + per - (55 - inix)){
               tp[0] = x - inix;
           }
           else if(x > xp && x < xp + per){
               if(x > xp + inix){
                   tp[0] = xp + per - 48;
               }
               else{
                   tp[0] = xp + 3;
               }
           }
           if(y > yp + iniy && y < yp + 400 - (55 - iniy)){
               tp[1] = y - iniy;
           }
           else if(y > yp && y < yp + 400){
               if(y > yp + iniy){
                   tp[1] = yp + 400 - 48;
               }
               else{
                   tp[1] = yp + 3;
               }
           }
           return tp;
           
       }
       function move(e){
           if(picked == 1){
               picked = 2;
               return;
           }
           let tp = inside(e.clientX, e.clientY);
           
           if(tp[0] == -1 || tp[1] == -1){
               drop();
               return;
           }
           
           node.style.left = tp[0];
           node.style.top = tp[1];
           canvas.clearRect(0, 0, per, 400);
           
           for(let i = 0; i < edges.length; i++){
                let u = edges[i][0];
                let v = edges[i][1];
               
                make_edge(u, v);
           }
           drop();
       }
       function drop(e){
           picked = 0;
           unselect();
           document.removeEventListener("click", move);
           node.addEventListener("click", pick);
       }

       node.addEventListener("click", pick);
    }
    function config_node(){
        let name_panel = document.querySelector('#name_panel');
        name_panel.style.display = "block";
    }
    function config_edge(){
        let label_panel = document.querySelector('#label_panel');
        label_panel.style.display = "block";
    }
    function rand(l, r){
        return Math.floor(Math.random() * (r - l + 1) + l);
    }
    function valid(n){
        if(Number(n) > 0 && Number(n) < 100){
            return 1;    
        }
        return 0;
    }
    function read_edge(){
        let nodeA = document.querySelector("#nodeA");
        let nodeB = document.querySelector("#nodeB");
        
        let u = nodeA.value;
        let v = nodeB.value;
        
        create_edge(u, v);
    }
    function read_name(){
        let input = document.querySelector("#idnode");
        let name = input.value;
        
        if(valid(name)){
            create_node(name);    
        }
    }
    function create_line(x1, y1, x2, y2){
        canvas.beginPath()
        canvas.moveTo(x1, y1)
        canvas.globalAlpha = "0.8";
        canvas.lineTo(x2, y2)
        canvas.stroke()
    }
    function create_edge(u, v){
        if(!valid(u)){
            return;    
        }
        if(!valid(v)){
            return;    
        }
        
        create_node(u);
        create_node(v);
        make_edge(u, v);
    }
    function make_edge(u, v){
        let nodeU = document.getElementById(u + "");
        let nodeV = document.getElementById(v + "");
        let posU = nodeU.getBoundingClientRect();
        let posV = nodeV.getBoundingClientRect();
        let uw = nodeU.offsetWidth / 2 - perx, uh = nodeU.offsetHeight / 2 - pery;
        let vw = nodeU.offsetWidth / 2 - perx, vh = nodeU.offsetHeight / 2 - pery;
        
        create_line(posU.left + uw, posU.top + uh, posV.left + vw, posV.top + vh);
    }
    function read_list(){
        let adlist = document.querySelector("#adlist");
        let list = adlist.value.split('\n');
        let nodes = document.querySelectorAll(".nodeform");
        
        canvas.clearRect(0, 0, 1000, 1000);
        for(let i = 0; i < nodes.length; i++){
            let cv = nodes[i].getContext('2d');
            cv.clearRect(0, 0, 100, 100)
        }
        edges = [];
        
        for(let i = 0; i < list.length; i++){
            let pair = list[i].split(" ");
         
            if(valid(pair[0]) && valid(pair[1])){
                create_edge(pair[0], pair[1])
                edges.push([pair[0], pair[1]])
            }
        }
    }
    
    new_node.addEventListener('click', config_node)
    send_node.addEventListener('click', read_name)
    adlist.addEventListener('input', read_list)
}




window.addEventListener("load", main)