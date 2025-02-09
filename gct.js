function main(){
   let screen = document.querySelector("#screen");
   let canvas = screen.getContext("2d");
   let new_node = document.querySelector("#newnode");
   let new_edge = document.querySelector("#newedge");
   let send_node = document.querySelector("#send_node");
   let send_edge = document.querySelector("#send_edge");
   let edges = [];
   let node_list = new Map();
    
   function create_node(node_name){
        let node = document.createElement('div');
        let numlab = document.createElement('h1');
        let body = document.getElementsByTagName('body')[0]; 
        let pos, inix, iniy;
        
        node.innerHTML = "<canvas class=nodeform width=50px height=50px></canvas>"; 
        
        let nodeform = node.firstChild;
        let canvas2 = nodeform.getContext('2d'); 
       
        canvas2.beginPath();
        canvas2.arc(25, 25, 20, Math.PI * 2, false);
        canvas2.fill();
        
        node.className = "node";
        node.id = node_name;
        node_list[node_name] = 1;
        numlab.className = "node_number";
        numlab.textContent = node_name;
        node.appendChild(numlab);
        body.appendChild(node);

        function pick(e){
           pos = node.getBoundingClientRect();
           inix = (e.clientX - pos.left);
           iniy = (e.clientY - pos.top);
           document.addEventListener("mousemove", move);
       }
       function move(e){
           let tox = e.clientX - inix;
           let toy = e.clientY - iniy;

           node.style.left = tox;
           node.style.top = toy;
           canvas.clearRect(0, 0, 800, 400);
           
           for(let i = 0; i < edges.length; i++){
                let u = edges[i][0];
                let v = edges[i][1];
               
                make_edge(u, v);
           }
       }
       function drop(e){
           document.removeEventListener("mousemove", move);

       }

       node.addEventListener("mousedown", pick);
       node.addEventListener("mouseup", drop);
    }
    function config_node(){
        let name_panel = document.querySelector('#name_panel');
        name_panel.style.display = "block";
    }
    function config_edge(){
        let label_panel = document.querySelector('#label_panel');
        label_panel.style.display = "block";
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
        
        if(!valid(u)){
            return;    
        }
        if(!valid(v)){
            return;    
        }
        
        if(!node_list[u]){
            create_node(u);
        }
        if(!node_list[v]){
            create_node(v);
        }
        
        create_edge(u, v);
    }
    function read_name(){
        let input = document.querySelector("#idnode");
        let name = input.value;
        
        if(valid(name) && !node_list[name]){
            create_node(name);    
        }
    }
    function create_line(x1, y1, x2, y2){
        requestAnimationFrame(create_line)
        canvas.beginPath()
        canvas.moveTo(x1, y1)
        canvas.lineTo(x2, y2)
        canvas.stroke()
    }
    function create_edge(u, v){
        edges.push([u, v]);
        make_edge(u, v);
    }
    function make_edge(u, v){
        let nodeU = document.getElementById(u + "");
        let nodeV = document.getElementById(v + "");
        let posU = nodeU.getBoundingClientRect();
        let posV = nodeV.getBoundingClientRect();
        
        create_line(posU.left + 25, posU.top + 25, posV.left + 25, posV.top + 25);
    }
    new_node.addEventListener('click', config_node)
    new_edge.addEventListener('click', config_edge)
    send_edge.addEventListener('click', read_edge)
    send_node.addEventListener('click', read_name)
}




window.addEventListener("load", main)