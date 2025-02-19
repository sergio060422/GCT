function main(){ 
   let new_node = document.querySelector("#newnode");
   let new_edge = document.querySelector("#newedge");
   let screen_con = document.querySelector("#screen_con");
   let body = document.querySelector("body");
   let node_list = new Map(), edges = [];
   let per = screen_con.offsetWidth - 40;
   let perh = body.offsetHeight - 280;
   let adlist = document.querySelector("#adlist");
   let prompt = document.getElementById("prompt");
   let input = document.querySelector("#idnode");
   let all = document.getElementById("all");    
   if(body.offsetWidth < 600){
       perh += 40;
   }
   screen_con.innerHTML = "<canvas class=screen width=" + per + "px" + " height="+perh+"px"+"></canvas>";
   let screen = screen_con.firstChild;
   let canvas = screen.getContext("2d");
   let pos = screen.getBoundingClientRect();
   let pery = pos.top + 1;
   let perx = pos.left + 1;
   let pcx, pcy, val_width = "2", t = "40px", curr = 0;
   let graph = document.getElementById("graph");
   let edg = document.getElementById("edges");
   let logo = document.getElementById("logo");
   let clogo = logo.getContext('2d');
   let gt = document.getElementById("gt");
   adlist.style.height = perh + 22;
    
   function draw_logo(){
       val_width = "1.5";
       draw_circle(clogo, 45, 15, 13, "blue");
       draw_circle(clogo, 15, 75, 13, "red");
       draw_circle(clogo, 75, 75, 13, "yellow");
       clogo.fillStyle = "white";
       clogo.font = "lighter 20px myFont";
       clogo.fillText("C", 39, 22);
       clogo.fillText("G", 9, 82);
       clogo.fillText("T", 70, 82);
       create_line(clogo, 38, 28, 22, 62);
       create_line(clogo, 52, 28, 68, 62);
       create_line(clogo, 30, 75, 60, 75);
   }
    
   if(body.offsetWidth > 600){
       val_width = "3";
       t = "48px";
   }
    
   function draw_circle(canvas, cx, cy, r, color, flag){
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
            nd.style.display = "block";
            return;
        }
       
        let node = document.createElement('div');
        let numlab = document.createElement('h1');
        let body = document.getElementsByTagName('body')[0]; 
        let pos, inix, iniy;
        
        node.innerHTML = "<canvas class=nodeform width="+t+" height="+t+"></canvas>"; 
        
        let lx = perx + 50, rx = screen_con.offsetWidth - perx - 50;
        let ly = pery + 50, ry = pery + perh - 50;
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
            graph.style.pointerEvents = "none";
            edg.style.pointerEvents = "none";
            gt.style.pointerEvents = "none";
            canvas2.clearRect(0, 0, 50, 50);
            draw_circle(canvas2, pcx, pcy, rc, "limegreen");
        }
        function unselect(){
            canvas2.clearRect(0, 0, 50, 50);
            graph.style.pointerEvents = "all";
            edg.style.pointerEvents = "all";
            gt.style.pointerEvents = "all";
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
           if(y > yp + iniy && y < yp + perh - (55 - iniy)){
               tp[1] = y - iniy;
           }
           else if(y > yp && y < yp + perh){
               if(y > yp + iniy){
                   tp[1] = yp + perh - 48;
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
           canvas.clearRect(0, 0, per, perh);
           
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
        let name = input.value;
        
        if(valid(name)){
            create_node(name);
            cancel();
        }
        else{
            input.value = "";
           
        }
    }
    function cancel(){
      prompt.style.display = "none";
      all.style.opacity ="1";

      all.style.pointerEvents = "all";
      input.value = "";
      let nodes = document.querySelectorAll('.node');
        
      for(let i = 0; i < nodes.length; i++){
           nodes.item(i).style.opacity = "1";
      }
    }
    function create_line(canvas, x1, y1, x2, y2){
        canvas.beginPath()
        canvas.moveTo(x1, y1)
        canvas.strokeStyle = "rgb(222, 222, 222)";
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
        
        create_line(canvas, posU.left + uw, posU.top + uh, posV.left + vw, posV.top + vh);
    }
    function read_list(){
        let adlist = document.querySelector("#adlist");
        let list = adlist.value.split('\n');
        let nodes = document.querySelectorAll(".node");
        
        canvas.clearRect(0, 0, 1000, 1000);
        for(let i = 0; i < nodes.length; i++){
            nodes[i].style.display = "none";
        }
        edges = [];
        if(!curr){
            return;
        }
        
        for(let i = 0; i < list.length; i++){
            let pair = list[i].split(" ");
         
            if(valid(pair[0]) && valid(pair[1])){
                create_edge(pair[0], pair[1]);
                edges.push([pair[0], pair[1]])
            }
        }
    }
    function message(){
       let ok = document.getElementById("ok");
       let cancelb = document.getElementById("cancel");
       let nodes = document.querySelectorAll('.node');
        
       for(let i = 0; i < nodes.length; i++){
           nodes.item(i).style.opacity = "0.55";
       }
       all.style.pointerEvents = "none";
       all.style.opacity = "0.3";
       prompt.style.display = "block";
       ok.addEventListener("click", read_name);
       cancelb.addEventListener("click", cancel);
    }
    let cont = document.getElementById("cont");
    let ec = document.getElementById("ec");
    let sel = document.getElementById("sel");
    let p = graph.getBoundingClientRect();
    sel.style.left = p.left + 3 + "px";
    sel.style.width = graph.offsetWidth - 8 + "px";
    function to_edge(){
        if(!curr){
            cont.style.display = "none";
            ec.style.display = "block";
            adlist.focus();
            read_list();
            sel.classList.remove("tograph");
            sel.classList.add("toedge");
            curr = 1;
        }
    }
    function to_graph(){
        if(curr){
            ec.style.display = "none";
            cont.style.display = "block";
            read_list();
            sel.classList.remove("toedge");
            sel.classList.add("tograph");
            curr = 0;
        }
    }
    function to_github(){
        window.location.replace("https://github.com/sergio060422/GCT");
    }
    new_node.addEventListener('click', message)
    graph.addEventListener('click', to_graph);
    edg.addEventListener('click', to_edge);
    gt.addEventListener('click', to_github);
    console.log(pos.top)
    draw_logo();
}

window.addEventListener("load", main)
