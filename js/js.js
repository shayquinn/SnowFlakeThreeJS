
import * as THREE from "../modules/three.module.js";
import { OrbitControls } from '../modules/OrbitControls.js';
import mergeBufferGeometries from '../modules/BufferGeometryUtils.js';
import { RGBELoader } from '../modules/RGBELoader.js';

    

/////////////////////////////
//THREE.js    ////////////////

var scene = null;
var renderer = null;
var camera = null;
var controls = null;

var group = null;
var Geos = null;

//var clock = new THREE.Clock();

var rorationX = false;
var rorationY = false;
var rorationZ = false;
var wirframeBull = false;
var mergMesh1 = null;

var hdrEquirect = null;
var envMapmaterial = null;


var pause = false;
var animPause = false;

//var uniformData = null;

var isPlay = true;

function initThreejs(){
    init();
    //axes();
    initLights();
    createMateral();
    animate(); 
}
 
function init() {
    ///////// renderer //////////
    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //exposure leve
    renderer.toneMappingExposure = 0.2;
    //color gradent
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    // turn on the physically correct lighting model
    renderer.physicallyCorrectLights = true;
    renderer.shadowMapEnabled = true;
    
    var con5 = document.getElementById("con1");
    con5.appendChild(renderer.domElement );
    
    ///////// scene //////////
    scene = new THREE.Scene();
    
    ///////// camera //////////
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.position.set(0, 0, 10);
    camera.lookAt( 0, 0, 0 );
    
    ///////// controls //////////
    controls = new OrbitControls(camera, renderer.domElement);
    //https://www.youtube.com/watch?v=pqdbA-fLAnA&ab_channel=flanniganable
    //controls.enable = true; // turn off mouse controle
    
    //controls.target = new THREE.Vector3(5, 0, 0);
    //controls.target =  group.position; // set camra target

    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableZoom = true;

    controls.minDistance = 1; // how close camra can zoom/dolly in (default =1)
    controls.maxDistance = 4000; // (default = infinity)
    
    controls.enableDamping = false; // enable inertia (default = false)
    controls.dampingFactor = 0.01; // lower = less responsive
    
    controls.enableRotate = true; // auto rotate around target (default = false)
    controls.autoRotateSpeed = 2.0; // how fast to rotate around target (default = 2)
    
    controls.zoomSpeed = 0.7; // speed of the zoom/dollying (default = 1)


    //controls.addEventListener( 'change', PauseCall );


    group = new THREE.Group();
    scene.add(group);     
        
    /////// stats
    /*
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    */
}//end init

////// animate
function animate() {
    if (isPlay){
        //stats.begin();
        if(!animPause){
            if(!pause){
                requestAnimationFrame(animate);
                // required if controls.enableDamping or controls.autoRotate are set to true
                //controls.update();
                renderer.render( scene, camera );
            }
        }else{
            requestAnimationFrame(animate);
            // required if controls.enableDamping or controls.autoRotate are set to true
            //controls.update();
            if(group != undefined){
                if(rorationX){ group.rotation.x += 0.01; }
                if(rorationY){ group.rotation.y += 0.01; }
                if(rorationZ){ group.rotation.z += 0.01; }
                if(wirframeBull){}else{}
                //if(mergMeshBull){group.add(mergMesh1);}else{group.remove(mergMesh1);}
            }
            renderer.render( scene, camera );
        }
        //stats.end();
    }
  
 }//end animate

function returnVertexs(f){
    let pf1z = f.size, pf2z = f.size, pb1z = -f.size, pb2z = -f.size;
    let pt1 = f.p1;
    let pt2 = f.p2;
    let pts = f.hexagon.points;
    let vers = [];
    //front

    vers.push({ pos: [pts[3].x, pts[3].y,  0], norm: [ 0,  0,  1], uv: [1, 1], });
    vers.push({ pos: [pts[4].x, pts[4].y,  0], norm: [ 0,  0,  1], uv: [0, 0], });
    vers.push({ pos: [pt1.x,    pt1.y,  pf1z], norm: [ 0,  0,  1], uv: [1, 0], }); //p1  
    
    vers.push({ pos: [pt1.x,    pt1.y,  pf1z], norm: [ 0,  0,  1], uv: [1, 0], }); //p1
    vers.push({ pos: [pts[2].x, pts[2].y,  0], norm: [ 0,  0,  1], uv: [1, 1], }); //p2  
    vers.push({ pos: [pts[3].x, pts[3].y,  0], norm: [ 0,  0,  1], uv: [0, 0], });

    vers.push({ pos: [pts[2].x, pts[2].y,  0], norm: [ 0,  0,  1], uv: [0, 0], });
    vers.push({ pos: [pt1.x,    pt1.y,  pf1z], norm: [ 0,  0,  1], uv: [1, 0], }); //p1
    vers.push({ pos: [pt2.x,    pt2.y,  pf2z], norm: [ 0,  0,  1], uv: [1, 1], }); //p2  

    vers.push({ pos: [pts[2].x, pts[2].y,  0], norm: [ 0,  0,  1], uv: [0, 0], });
    vers.push({ pos: [pt2.x,    pt2.y,  pf2z], norm: [ 0,  0,  1], uv: [1, 1], }); //p1
    vers.push({ pos: [pts[1].x, pts[1].y,  0], norm: [ 0,  0,  1], uv: [1, 0], }); //p2 


    vers.push({ pos: [pts[1].x, pts[1].y,  0], norm: [ 0,  0,  1], uv: [0, 0], });
    vers.push({ pos: [pt2.x,    pt2.y,  pf2z], norm: [ 0,  0,  1], uv: [1, 0], }); //p1
    vers.push({ pos: [pts[0].x, pts[0].y,  0], norm: [ 0,  0,  1], uv: [1, 1], }); //p2  

    vers.push({ pos: [pts[0].x, pts[0].y,  0], norm: [ 0,  0,  1], uv: [0, 0], });
    vers.push({ pos: [pt2.x,    pt2.y,  pf2z], norm: [ 0,  0,  1], uv: [1, 0], }); //p1
    vers.push({ pos: [pts[5].x, pts[5].y,  0], norm: [ 0,  0,  1], uv: [1, 1], }); //p2  

    vers.push({ pos: [pts[5].x, pts[5].y,  0], norm: [ 0,  0,  1], uv: [0, 1], });
    vers.push({ pos: [pt2.x,    pt2.y,  pf2z], norm: [ 0,  0,  1], uv: [1, 1], }); //p1
    vers.push({ pos: [pts[4].x, pts[4].y,  0], norm: [ 0,  0,  1], uv: [0, 0], }); //p2  

    vers.push({ pos: [pts[4].x, pts[4].y,  0], norm: [ 0,  0,  1], uv: [0, 0], });
    vers.push({ pos: [pt2.x,    pt2.y,  pf2z], norm: [ 0,  0,  1], uv: [1, 1], }); //p1
    vers.push({ pos: [pt1.x,    pt1.y,  pf1z], norm: [ 0,  0,  1], uv: [1, 0], }); //p2  
    /////////////////
    vers.push({ pos: [pts[3].x, pts[3].y,  0], norm: [ 0,  0,  -1], uv: [1, 1], });
    vers.push({ pos: [pt1.x,    pt1.y,  pb1z], norm: [ 0,  0,  -1], uv: [1, 0], }); //p1/
    vers.push({ pos: [pts[4].x, pts[4].y,  0], norm: [ 0,  0,  -1], uv: [0, 0], });
     
    
    vers.push({ pos: [pt1.x,    pt1.y,  pb1z], norm: [ 0,  0,  -1], uv: [1, 0], }); //p1
    vers.push({ pos: [pts[3].x, pts[3].y,  0], norm: [ 0,  0,  -1], uv: [0, 0], });
    vers.push({ pos: [pts[2].x, pts[2].y,  0], norm: [ 0,  0,  -1], uv: [1, 1], }); //p2/  
    

    vers.push({ pos: [pts[2].x, pts[2].y,  0], norm: [ 0,  0,  -1], uv: [0, 0], });
    vers.push({ pos: [pt2.x,    pt2.y,  pb2z], norm: [ 0,  0,  -1], uv: [1, 1], }); //p2
    vers.push({ pos: [pt1.x,    pt1.y,  pb1z], norm: [ 0,  0,  -1], uv: [1, 0], }); //p1/
      

    vers.push({ pos: [pts[2].x, pts[2].y,  0], norm: [ 0,  0,  -1], uv: [0, 0], });
    vers.push({ pos: [pts[1].x, pts[1].y,  0], norm: [ 0,  0,  -1], uv: [1, 0], }); //p2 
    vers.push({ pos: [pt2.x,    pt2.y,  pb2z], norm: [ 0,  0,  -1], uv: [1, 1], }); //p1/
   


    vers.push({ pos: [pts[1].x, pts[1].y,  0], norm: [ 0,  0,  -1], uv: [0, 0], });
    vers.push({ pos: [pts[0].x, pts[0].y,  0], norm: [ 0,  0,  -1], uv: [1, 1], }); //p2 
    vers.push({ pos: [pt2.x,    pt2.y,  pb2z], norm: [ 0,  0,  -1], uv: [1, 0], }); //p1/
    

    vers.push({ pos: [pts[0].x, pts[0].y,  0], norm: [ 0,  0,  -1], uv: [0, 0], });
    vers.push({ pos: [pts[5].x, pts[5].y,  0], norm: [ 0,  0,  -1], uv: [1, 1], }); //p2
    vers.push({ pos: [pt2.x,    pt2.y,  pb2z], norm: [ 0,  0,  -1], uv: [1, 0], }); //p1/
     

    vers.push({ pos: [pts[5].x, pts[5].y,  0], norm: [ 0,  0,  -1], uv: [0, 1], });
    vers.push({ pos: [pts[4].x, pts[4].y,  0], norm: [ 0,  0,  -1], uv: [0, 0], }); //p2 
    vers.push({ pos: [pt2.x,    pt2.y,  pb2z], norm: [ 0,  0,  -1], uv: [1, 1], }); //p1/
     

    vers.push({ pos: [pts[4].x, pts[4].y,  0], norm: [ 0,  0,  -1], uv: [0, 0], });
    vers.push({ pos: [pt1.x,    pt1.y,  pb1z], norm: [ 0,  0,  -1], uv: [1, 0], }); //p2 
    vers.push({ pos: [pt2.x,    pt2.y,  pb2z], norm: [ 0,  0,  -1], uv: [1, 1], }); //p1/
    
    

return vers;
}//end returnVertexs

function initLights(){
    const light = new THREE.DirectionalLight(0xfff0dd, 1);
    light.position.set(0, 5, 10);
    scene.add(light);
    //HemisphereLight
    const upColor = 0xffff80;
    const downColor = 0x4040ff;
    const hemLight = new THREE.HemisphereLight(upColor, downColor, 1.0);
    scene.add(hemLight);
}//end initLights

function createMateral(){
 
    let metalness_map = new THREE.TextureLoader().load('./textures/pbr/metallic.jpg');
    let roughness_map = new THREE.TextureLoader().load('./textures/pbr/roughness.jpg');
    let normal_map = new THREE.TextureLoader().load('./textures/pbr/normal.jpg');

    //"./textures/envMap/kloppenheim_06_puresky_4k.hdr",  
    // "./textures/envMap/snowy_park_01_4k.hdr",  
    hdrEquirect = new RGBELoader().load(
        "./textures/envMap/kloppenheim_06_puresky_4k.hdr",  
        () => { 
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping; 
        scene.background = hdrEquirect;
        //scene.environment = hdrEquirect;
        }
    );

    envMapmaterial = new THREE.MeshPhysicalMaterial({  
    transmission: 1.0,  
    thickness: 3.5, // Add refraction!

    envMap: hdrEquirect,
    envMapIntensity: 3.0,

    roughnessMap: roughness_map,
    roughness: 0.2, 

    normalMap: normal_map,
    normalScale: new THREE.Vector2(1,1), 

    //displacementMap: height_map,
    //displacementScale: 0.1,
    //displacementBias: -0.05,
    
    //aoMap: ambient_occ_map,
    //aoMapIntensity: 1.5,

    metalnessMap: metalness_map,
    metalness: 0.5,

  });

  envMapmaterial.side = THREE.DoubleSide;
}//createMateral

function drawBufferMesh(flakes){

    Geos = [];

    for(const flake of flakes){
        let vertices = returnVertexs(flake);
        const positions = [];
        const normals = [];
        const uvs = [];
        for (const vertex of vertices) {
        positions.push(...vertex.pos);
        normals.push(...vertex.norm);
        uvs.push(...vertex.uv);
        }
        const geometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
        geometry.computeVertexNormals();
        Geos.push(geometry);
    }

    const mergGeomaterys1 = mergeBufferGeometries.mergeBufferGeometries(Geos);
    mergGeomaterys1.computeVertexNormals();
    
    mergMesh1 = new THREE.Mesh(mergGeomaterys1, envMapmaterial);
    //const VNhelper = new VertexNormalsHelper(mergMesh1, 20, 0xff0000 );

    mergMesh1.dynamic = true;
    
    if(group != null){
        while(group.children.length > 0){ 
            group.remove(group.children[0]); 
        }
    }
    group.add(mergMesh1); 
    //console.log(scene.children);
}//end drawBufferMesh

////////////////////////////////

/*jshint esversion: 6 */
document.addEventListener("DOMContentLoaded", () => {
    var dataObj;
    var flakes = [];

    //var angList3 = [-60, 0, 60, 120, 180, -120];
    //var angList3 = [270, 330, 30, 90, 150, 210];
    var angList3 = [-90, -30, 30, 90, 150, -150];
    //var sw = (window.innerWidth/2)/50, sh = (window.innerHeight / 2)/50;
    
    const centerP = new Point(0, 0);

    var branchL = 2;
    var scale = 0.5;

    var idCount;

    var shortPoint;
    var closest_intersection;
    var check;
    var peak;
    var peakLine;

////////////////////////////////


//Menu functions ///////////////////

function Collapsible(i, text, inId, spId){ 
    let val =  Number(document.getElementById(inId).value); 
    switch(text){
        case "Length ": 
            dataObj.BOs[i] = new Branch(
                dataObj.BOs[i].startPoint,
                val/100,
                dataObj.BOs[i].size,
                dataObj.BOs[i].ofs
            );
        break;
        case "Size ":
            dataObj.BOs[i] = new Branch(
                dataObj.BOs[i].startPoint,
                dataObj.BOs[i].len,
                val/100,
                dataObj.BOs[i].ofs
            );
        break;
        case "Offset ":
            dataObj.BOs[i] = new Branch(
                dataObj.BOs[i].startPoint,
                dataObj.BOs[i].len,
                dataObj.BOs[i].size,
                val
            );
        break;
        default:
        break;
    } 
   
    document.getElementById(spId).innerHTML = text+(i+1)+":"+val;
    sessionStorageSaveArray();
}//end Collapsible

function populatyeCollapsible(){
    let coll1 = document.getElementById("coll1");
    let coll2 = document.getElementById("coll2");
    let coll3 = document.getElementById("coll3");
      
    for(let i=0;i<12;i++){
        var DIV = document.createElement("DIV");
        DIV.setAttribute("class", "flex-container");   
        var SPAN = document.createElement("SPAN");
        SPAN.setAttribute("id", "spanl"+(i+1));
        SPAN.setAttribute("class", "spanClass");
        SPAN.innerHTML = "Length "+(i+1)+":";
        var INPUT = document.createElement("INPUT");
        INPUT.setAttribute("id", "inputl"+(i+1));
        INPUT.setAttribute("class", "slider");
        INPUT.setAttribute("type", "range");
        INPUT.setAttribute("min", 5);
        INPUT.setAttribute("max", 400);
        INPUT.setAttribute("value", 200);

        DIV.appendChild(SPAN);
        DIV.appendChild(INPUT);
        coll1.appendChild(DIV);

        INPUT.addEventListener('input',(e)=>{
            Collapsible(i, "Length ", "inputl"+(i+1), "spanl"+(i+1));
        });
    }

    for(let i=0;i<12;i++){
        var DIV = document.createElement("DIV");
        DIV.setAttribute("class", "flex-container");  
        var SPAN = document.createElement("SPAN");
        SPAN.setAttribute("id", "spanS"+(i+1));
        SPAN.setAttribute("class", "spanClass");
        SPAN.innerHTML = "Size "+(i+1)+":";
        var INPUT = document.createElement("INPUT");
        INPUT.setAttribute("id", "inputS"+(i+1));
        INPUT.setAttribute("class", "slider");
        INPUT.setAttribute("type", "range");
        INPUT.setAttribute("min", 1);
        INPUT.setAttribute("max", 100);
        INPUT.setAttribute("value", 50);

        DIV.appendChild(SPAN);
        DIV.appendChild(INPUT);
        coll2.appendChild(DIV);

        INPUT.addEventListener('input',(e)=>{
            Collapsible(i, "Size ", "inputS"+(i+1), "spanS"+(i+1));
        });
    }

    for(let i=0;i<12;i++){
        var DIV = document.createElement("DIV");
        DIV.setAttribute("class", "flex-container");
        var SPAN = document.createElement("SPAN");
        SPAN.setAttribute("id", "spanO"+(i+1));
        SPAN.setAttribute("class", "spanClass");
        SPAN.innerHTML = "Offset "+(i+1)+":";
        var INPUT = document.createElement("INPUT");
        INPUT.setAttribute("id", "inputO"+(i+1));
        INPUT.setAttribute("class", "slider");
        INPUT.setAttribute("type", "range");
        INPUT.setAttribute("min", 0);
        INPUT.setAttribute("max", 50);
        INPUT.setAttribute("value", 25);

        DIV.appendChild(SPAN);
        DIV.appendChild(INPUT);
        coll3.appendChild(DIV);

        INPUT.addEventListener('input',(e)=>{
            Collapsible(i, "Offset ", "inputO"+(i+1), "spanO"+(i+1));
        });
    }

}//end populatyeCollapsible

function MD(){ 
    if(!animPause){
        if(pause){
            pause = false;
            //console.log("Unpaused!"); 
            animate();   
        } 
    }  
}//end MUD
function MU(){
    if(!animPause){
        if(!pause){
            pause = true;
            //console.log("Paused!");
            animate();
        }
    }
}//end MUD

function updatePause(){
    if(animPause){
        Pause.value = "Play";
        animPause = false;     
    }else{
        Pause.value = "Pause";
        animPause = true;
    }
}//end updatePause

function callRender(){
    renderer.render( scene, camera );
}//end callRender

window.onload = function(){

    document.body.addEventListener("mouseup", MU);
    document.body.addEventListener("mousedown", MD);
    document.body.addEventListener("wheel", MD);

    var ttb1 = document.getElementById("ttb1");
    ttb1.addEventListener('click',(e)=>{
        Pause.value = "Pause";
        animPause = true;
        if(rorationX){
            rorationX = false;
        }else{
            rorationX = true;
        }
        ttb1.value = "Rotation X: "+rorationX;
        updateToggels(ttb1, rorationX);
    });
    var ttb2 = document.getElementById("ttb2");
    ttb2.addEventListener('click',(e)=>{
        Pause.value = "Pause";
        animPause = true;
        if(rorationY){
            rorationY = false;
        }else{
            rorationY = true;
        }
        ttb2.value = "Rotation Y: "+rorationY;
        updateToggels(ttb2, rorationY);
    });
    var ttb3 = document.getElementById("ttb3");
    ttb3.addEventListener('click',(e)=>{
        Pause.value = "Pause";
        animPause = true;
        if(rorationZ){
            rorationZ = false;
        }else{
            rorationZ = true;
        }
        ttb3.value = "Rotation Z: "+rorationZ;
        updateToggels(ttb3, rorationZ);
    });
    var ttb4 = document.getElementById("ttb4");
    ttb4.addEventListener('click',(e)=>{
        rorationX = false;
        rorationY = false;
        rorationZ = false;
        ttb1.value = "Rotation X: "+rorationX;
        updateToggels(ttb1, rorationX);
        ttb2.value = "Rotation Y: "+rorationY;
        updateToggels(ttb2, rorationY);
        ttb3.value = "Rotation Z: "+rorationZ;
        updateToggels(ttb3, rorationZ);
        if(group != undefined ){
            group.rotation.x = 0;
            group.rotation.y = 0;
            group.rotation.z = 0;
        }
        callRender();
        Pause.value = "Play";
        animPause = false;
    });
    var Pause = document.getElementById("Pause");
    Pause.addEventListener('click',(e)=>{ 
        updatePause();
    });

    //tab1
    //Collapsible ///////////////
    populatyeCollapsible();

    /////////////////////
    
    var levelS = document.getElementById("levelS");
    var levelL = document.getElementById("levelL");

    levelS.addEventListener('input',(e)=>{
        dataObj.level = levelS.value;
        levelL.innerHTML = "Level "+ dataObj.level;
        sessionStorageSaveArray();     
    });

    var cropS = document.getElementById("cropS");
    var cropL = document.getElementById("cropL");
    cropS.addEventListener('input',(e)=>{
        dataObj.cropAngel = cropS.value;
        cropL.innerHTML = "Crop-angle "+ dataObj.cropAngel;
        sessionStorageSaveArray();
    });
    var spaceS = document.getElementById("spaceS");
    var spaceL = document.getElementById("spaceL");
    spaceS.addEventListener('input',(e)=>{
        dataObj.SpaceLines = spaceS.value;
        spaceL.innerHTML = "Line-space "+ dataObj.SpaceLines;
        sessionStorageSaveArray();
    });

    var tb1 = document.getElementById("tb1");
    tb1.addEventListener('click',(e)=>{
        if(dataObj.singleTog == false){
    			dataObj.singleTog = true;
    		}else{
          dataObj.singleTog = false;
        }
        tb1.value = "TogSingle "+dataObj.singleTog;
        sessionStorageSaveArray();
        updateToggels(tb1, dataObj.singleTog);
        callRender();
    });

    var tb2 = document.getElementById("tb2");
    tb2.addEventListener('click',(e)=>{
      	if(dataObj.mirrorTog == false){
    			dataObj.mirrorTog = true;
    		}else{
          dataObj.mirrorTog = false;
        }
        tb2.value = "TogMirror "+dataObj.mirrorTog;
        sessionStorageSaveArray();
        updateToggels(tb2, dataObj.mirrorTog);
        callRender();
    });

    var tb6 = document.getElementById("tb6");
    tb6.addEventListener('click',(e)=>{
        console.log('random all');
        randomise("all");
        sessionStorageSaveArray();
        callRender();
    });

    var tb7 = document.getElementById("tb7");
    tb7.addEventListener('click',(e)=>{
        console.log('random length');
        randomise("length");
        sessionStorageSaveArray();
        callRender();
    });

    var tb8 = document.getElementById("tb8");
    tb8.addEventListener('click',(e)=>{
        console.log('random size');
        randomise("size");
        sessionStorageSaveArray();
        callRender();
    });
    var tb9 = document.getElementById("tb9");
    tb9.addEventListener('click',(e)=>{
        console.log('random offset');
        randomise("offset");
        sessionStorageSaveArray();
        callRender();
    });

    var ReF = document.getElementById("Refresh");
    ReF.addEventListener('click',(e)=>{
        sessionStorage.clear();
        location.reload();
    });



    var Save = document.getElementById("Save");
    //https://www.sanwebe.com/snippet/downloading-canvas-as-image-dataurl-on-button-click
    Save.addEventListener('click',(e)=>{
        console.log('save');
        var image = renderer.domElement.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let link = document.createElement('a');
        link.download = "my-image.png";
        link.href = image;
        link.click();
    });

    var SaveJson = document.getElementById("SaveJson");
    SaveJson.addEventListener('click',(e)=>{
        console.log('SaveJson');
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj));
        let link = document.createElement("a");
        link.download = "yourfile.json";
        link.href = data;
        link.click();
    });

    var LoadJson = document.getElementById("LoadJson");
    LoadJson.addEventListener('click',(e)=>{
        document.getElementById('my_file').click();

    });

    var fi = document.getElementById("my_file");
    fi.addEventListener('change',(e)=>{
        console.log('LoadJson');
        var fr = new FileReader();
        fr.readAsText(fi.files[0]);
        fr.addEventListener('load', () => {
            let url = fr.result;
            var data = decodeURIComponent(url);
            let dOBJ = JSON.parse(data);
            sessionStorage.setItem("dataObjStr", JSON.stringify(dOBJ));
            sessionStorageDecodeArray();
            update();
        });
    });

    var menuC = document.getElementById("menuC"); //closeNav()
    menuC.addEventListener('click',(e)=>{
        document.getElementById("mySidenav").style.width = "0";
        document.body.style.backgroundColor = "white";
        menuO.style.display = "block";
    });

    var menuO = document.getElementById("menuO"); //openNav()
    menuO.addEventListener('click',(e)=>{
        document.getElementById("mySidenav").style.width = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        menuO.style.display = "none";
    });

//Start Call ///////////////////
init();
};//end onload

function sessionStorageSaveArray(){
    sessionStorage.setItem("dataObjStr", JSON.stringify(dataObj));
    update();
}//end sessionStorageArray

function sessionStorageDecodeArray(){
    if(sessionStorage.getItem("dataObjStr") != null){
        let dataObjStr = JSON.parse(sessionStorage.getItem("dataObjStr"));   
        dataObj.BOs = [];
        for(let i=0;i<dataObjStr.BOs.length;i++){
            dataObj.BOs.push(
                new Branch(
                    new Point(dataObjStr.BOs[i].startPoint.x, dataObjStr.BOs[i].startPoint.y),
                    dataObjStr.BOs[i].len,
                    dataObjStr.BOs[i].size,
                    dataObjStr.BOs[i].ofs
                )
            );
        }

        dataObj.LBOs = [];
        for(let i=0;i<dataObjStr.LBOs.length;i++){
            dataObj.LBOs.push(
                new Line(
                    new Point(dataObjStr.LBOs[i].p1.x, dataObjStr.LBOs[i].p1.y),
                    new Point(dataObjStr.LBOs[i].p2.x, dataObjStr.LBOs[i].p2.y)
                )
            );
        }

        dataObj.level = dataObjStr.level;
        levelL.innerHTML = "Level "+ dataObj.level;
        levelS.value = dataObj.level;


        dataObj.cropAngel = dataObjStr.cropAngel;
        cropL.innerHTML = "Crop-angle "+ dataObj.cropAngel;
        cropS.value = dataObj.cropAngel;

        dataObj.SpaceLines = dataObjStr.SpaceLines;
        spaceL.innerHTML = "Line-space "+ dataObj.SpaceLines;
        spaceS.value = dataObj.SpaceLines;

        dataObj.singleTog = dataObjStr.singleTog;
        tb1.value = "TogSingle "+dataObj.singleTog;
        updateToggels(tb1, dataObj.singleTog);
        
        dataObj.mirrorTog = dataObjStr.mirrorTog;
        tb2.value = "TogMirror "+dataObj.mirrorTog;
        updateToggels(tb2, dataObj.mirrorTog);

      
        //openNav();
    }
}//end sessionStorageArray

//Init   ///////////////////
function init(){ 
    dataObj = {
        "BOs": null,
        "LBOs": null,
        "level": 3,
        "cropAngel": 40,
        "SpaceLines": 0,
        "singleTog": false,
        "mirrorTog": true,  
    };
    sessionStorageDecodeArray();
    initThreejs();
    update();
}//end init

//Update   ///////////////////
function update(){
    createBranchlist();
    updateCollapsible();
    drawBufferMesh(flakes);
   // updateVertexes(flakes)
}//end update

function updateCollapsible(init){
    let elist1 = document.getElementById("coll1").childNodes;
    let elist2 = document.getElementById("coll2").childNodes;
    let elist3 = document.getElementById("coll3").childNodes;
    let count = 1;   
    for(let i=1;i<elist1.length;i++){
        if(dataObj.level > 0){
            if(count <= dataObj.level){
                if(dataObj.BOs[(count-1)] !== undefined){
                    let sp1= elist1[i].childNodes[0];
                    let ip1 = elist1[i].childNodes[1];
                    let bl = Math.floor(Number(dataObj.BOs[(count-1)].len)*100);
                    
                    let sp2 = elist2[i].childNodes[0];
                    let ip2 = elist2[i].childNodes[1];
                    let siz =  Math.floor(Number(dataObj.BOs[(count-1)].size)*100);
      

                    let sp3= elist3[i].childNodes[0];
                    let ip3 = elist3[i].childNodes[1];
                    let ofs = Math.floor(Number(dataObj.BOs[(count-1)].ofs));
                    if (sp1 !== undefined){
                        sp1.innerHTML = 'Length '+count+': '+bl;
                    }
                    if (ip1 !== undefined){
                        ip1.value = bl;
                    }

                    if (sp2 !== undefined){
                        sp2.innerHTML = 'Size '+count+': '+siz;
                    }
                    if (ip2 !== undefined){
                        ip2.value = siz;
                    }

                    if (sp3 !== undefined){
                        sp3.innerHTML = 'Offset '+count+': '+ofs;
                    }
                    if (ip3 !== undefined){
                        ip3.value = ofs;
                    }
                }         
                if(elist3[i].tagName == 'DIV'){
                    elist3[i].style.display = "block";           
                }
                if(elist2[i].tagName == 'DIV'){
                    elist2[i].style.display = "block";         
                }
                if(elist1[i].tagName == 'DIV'){
                    elist1[i].style.display = "block";  
                    count++;          
                }
            }else{
                if(elist1[i].tagName == 'DIV'){
                    elist1[i].style.display = "none";
                }
                if(elist2[i].tagName == 'DIV'){
                    elist2[i].style.display = "none";         
                }
                if(elist3[i].tagName == 'DIV'){
                    elist3[i].style.display = "none";         
                }
            }
        }else{
            if(elist1[i].tagName == 'DIV'){
                elist1[i].style.display = "none";
            }
            if(elist2[i].tagName == 'DIV'){
                elist2[i].style.display = "none";         
            }
            if(elist3[i].tagName == 'DIV'){
                elist3[i].style.display = "none";         
            }
        }
    }
}//end updateCollapsible

function updateToggels(element, variable){
        if(variable){
            element.classList.add("buttonToggel");
            element.classList.remove("button");
        }else{
            element.classList.add("button");
            element.classList.remove("buttonToggel");
        }
}//end updateMenu

//Collapsible
var coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}


//Drawing functions  ///////////////////

//Objects  ///////////////////

function Flake(p1, p2, level, size, dir, text, ofs){
     this.p1 = p1;
     this.p2 = p2;
     this.level = level;
     this.size = size; 
     this.dir = dir;
     this.text = text;
     this.ofs = ofs;
     this.line = new Line(this.p1, this.p2);
     this.hexObject = createHex(this.p1, this.p2, this.dir, this.size, this.ofs);
     this.hexagon = this.hexObject.hex;
     this.size1 = this.hexObject.size1;
     this.size2 = this.hexObject.size2;
}//end flake 

Flake.prototype.midPoint = function() {
    return new Point((this.p1.x + this.p2.x)/2, (this.p1.y + this.p2.y)/2); 
};

function Point(x, y) {
    this.x = x;
    this.y = y; 
}//end Point

function Line(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.x1 = p1.x;
    this.y1 = p1.y;
    this.x2 = p2.x;
    this.y2 = p2.x;
    this.startPoint = p1;
    this.endPoint = p2;
}//end Line

function Circle(p, r){
    this.p = p;
    this.r = r;
}//end Circle

function Branch(startPoint, len, size, ofs){
    this.startPoint = startPoint;
    this.len = len;
    this.size = size;
    this.ofs = ofs;
}//end Branch

Branch.prototype.endPoint = function() {
    return new Point(this.startPoint.x, (this.startPoint.y - this.len));
};

Branch.prototype.midPoint = function() {
    return new Point(this.startPoint.x, (this.startPoint.y - (this.len/2))); 
};

function Hexagon(points, point){
    this.points = points;
    this.point = point;
}//end Hexagon


//Create functions  ///////////////////

function createPlainHexagon(point, hexSize){
    let points = [];
    for(let i=0;i<6;i++){
        let p = convert(60 * i, new Point(point.x, point.y - hexSize), point);
        points[i] = new Point(p.x, p.y);
    }
    return new Hexagon(points, point);
}//end createHexagon

function createHex(p1, p2, dir, size, ofs) {
        let h1, h2, s1, s2;
        if(ofs < 25){
            ofs = 25 - ofs;
            s1 = size+(ofs/100);
            s2 = size;
            h1 = createPlainHexagon(p1, size+(ofs/100));
            h2 = createPlainHexagon(p2, size);
        }else if(ofs > 25){
            ofs = ofs-25;
            s1 = size;
            s2 = size+(ofs/100);
            h1 = createPlainHexagon(p1, size);
            h2 = createPlainHexagon(p2, size+(ofs/100));
        }else if(ofs == 25){
            ofs = 0;
            s1 = size;
            s2 = size;
            h1 = createPlainHexagon(p1, size);
            h2 = createPlainHexagon(p2, size);
        }
    return createHexCrystel(s1, s2, h1, h2, dir);
}//endcreateHex

function createHexCrystel(s1, s2, h1, h2, dir) {
        let points2 = [];
        let count = dir;
        for (let i = 0; i < 6; i++) {
            if (count > 5) {
                count = 0;
            }
            if (i == 0 || i == 1 || i == 5) {
                points2[i] = h2.points[count];
            } else {
                points2[i] = h1.points[count];
            }
            count++;
        }   
        return {size1: s1, size2: s2, hex: new Hexagon(points2, new Point(h1.point.x, h1.point.y))};
}//end createHexCrystel

function randomise(type){
    //Branch(startPoint, len, size, ofs)
    let BOsTemp = [];
    if(type === "all"){
        BOsTemp.push(new Branch(centerP, returnRandom(5, 300)/100, returnRandom(1, 50)/100, returnRandom(0, 50)));
        for(let i=1;i<dataObj.level;i++){
            BOsTemp.push(
                new Branch(
                    new Point(BOsTemp[i-1].endPoint.x, BOsTemp[i-1].endPoint.y),
                    returnRandom(5, 400)/100,
                    returnRandom(1, 100)/100,
                    returnRandom(10, 40)
                )
            );
        }
    }else if(type === "length"){
        BOsTemp.push(new Branch(centerP, returnRandom(5, 400)/100, dataObj.BOs[0].size, dataObj.BOs[0].ofs));
        for(let i=1;i<dataObj.level;i++){
            BOsTemp.push(
                new Branch(
                    new Point(BOsTemp[i-1].endPoint.x, BOsTemp[i-1].endPoint.y),
                    returnRandom(5, 400)/100,
                    dataObj.BOs[i].size,
                    dataObj.BOs[i].ofs
                )
            );
        }
    }else if(type === "size"){
        BOsTemp.push(new Branch(centerP, dataObj.BOs[0].len, returnRandom(1, 100)/100, dataObj.BOs[0].ofs));
        for(let i=1;i<dataObj.level;i++){
            BOsTemp.push(
                new Branch(
                    new Point(BOsTemp[i-1].endPoint.x, BOsTemp[i-1].endPoint.y),
                    dataObj.BOs[i].len,
                    returnRandom(1, 100)/100,
                    dataObj.BOs[i].ofs
                )
            );
        }
    }else if(type === "offset"){
        BOsTemp.push(new Branch(centerP, dataObj.BOs[0].len, dataObj.BOs[0].size, returnRandom(0, 50)));
        for(let i=1;i<dataObj.level;i++){
            BOsTemp.push(
                new Branch(
                    new Point(BOsTemp[i-1].endPoint.x, BOsTemp[i-1].endPoint.y),
                    dataObj.BOs[i].len,
                    dataObj.BOs[i].size,
                    returnRandom(0, 50)
                )
            );
        }
    }
    dataObj.BOs = BOsTemp;  
}//end randomise

function returnRandom(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
}//end returnRandom

function rd(num){
    //Round to One Decimal Place
    return (Math.round(num * 10) / 10);
}//end rd

function createBranchlist(){
    let size = scale;
    let bln = branchL;
    //if Branch Object List is null or empty populate it
    //Branch(startPoint, len, size, ofs)
    if(dataObj.BOs === null){
        dataObj.BOs = [];
        dataObj.BOs.push(new Branch(centerP, bln, size, 25));
        for (let i = 1; i < dataObj.level ; i++) {
            dataObj.BOs.push(new Branch(dataObj.BOs[dataObj.BOs.length-1].endPoint(), bln, size, 25));
        }
   }else{
        //Update add or remove Branch Object
        let BOsT = [];
        BOsT.push(new Branch(new Point(dataObj.BOs[0].startPoint.x, dataObj.BOs[0].startPoint.y), dataObj.BOs[0].len,  dataObj.BOs[0].size, dataObj.BOs[0].ofs));
        for (let i = 1; i < dataObj.level ; i++) {
            if(i < dataObj.BOs.length){
                BOsT.push(new Branch(dataObj.BOs[i-1].endPoint(), dataObj.BOs[i].len, dataObj.BOs[i].size, dataObj.BOs[i].ofs));
            }else{
                BOsT.push(new Branch(dataObj.BOs[dataObj.BOs.length-1].endPoint(), bln, size, 25));
            }    
        }
        dataObj.BOs = BOsT;
   } 
   createGuides();
}//end createBranchlist

function SumBranch(){
    let sumBranch = 0;
    for (let i = 0; i < dataObj.BOs.length ; i++) {
        sumBranch += rd(Number(dataObj.BOs[i].len));
        if(i == dataObj.BOs.length-1){
            sumBranch += (dataObj.BOs[i].size);
        }
    }return sumBranch;
}//end sumBranch

function createGuides(){
    dataObj.LBOs = [];
    //vertical line 
    let verticleLine = convert(270, new Point(centerP.x + SumBranch(), centerP.y), centerP);

    //crop line temp
    let cropLineTemp = convert(dataObj.cropAngel, new Point(verticleLine.x + SumBranch()-50, verticleLine.y), verticleLine);
    
    //v line temp SpaceLines
    let vLineTemp = convert(300, new Point(centerP.x + SumBranch()+100, centerP.y), centerP);
    let vLineTemp1 = convert(300, new Point(centerP.x + SumBranch()+100, centerP.y-Number(dataObj.SpaceLines)/100), new Point(centerP.x, centerP.y-Number(dataObj.SpaceLines)/100));
    //let vLineTemp = convert(300, new Point(centerP.x + SumBranch()+100, centerP.y), new point(centerP.x, centerP.y-5));
    
    //find intersection
    let crop_v_inter = findIntersection(new Line(verticleLine, cropLineTemp), new Line(centerP, vLineTemp));
    let crop_v_inter1 = findIntersection(new Line(verticleLine, cropLineTemp), new Line(new Point(centerP.x, centerP.y-Number(dataObj.SpaceLines)/100), vLineTemp1));
    //crop line
    let cropLine = new Line(verticleLine, crop_v_inter1);
    dataObj.LBOs.push(cropLine);
    //v line
    let vLine = new Line(new Point(centerP.x, centerP.y), crop_v_inter);
    let vLine1 = new Line(new Point(centerP.x, centerP.y-Number(dataObj.SpaceLines)/100), crop_v_inter1);
    dataObj.LBOs.push(vLine);
    dataObj.LBOs.push(vLine1);
    for(let i=0;i<dataObj.BOs.length;i++){
        /*
        let LineTemp1 = convert(330, new Point(
            dataObj.BOs[i].midPoint().x + SumBranch(),
            dataObj.BOs[i].midPoint().y-Number(dataObj.SpaceLines)/100),
            new Point(dataObj.BOs[i].midPoint().x, dataObj.BOs[i].midPoint().y-Number(dataObj.SpaceLines)/100)
            );
            */
        //let LineTemp2 = convert(330, new Point(dataObj.BOs[i].midPoint().x + SumBranch(), dataObj.BOs[i].midPoint().y), dataObj.BOs[i].midPoint());
        ///
        let LineTemp = convert(330, new Point(dataObj.BOs[i].midPoint().x + SumBranch(), dataObj.BOs[i].midPoint().y), dataObj.BOs[i].midPoint());
        let LineTempline = new Line(dataObj.BOs[i].midPoint(), LineTemp);
        if(checkLine(LineTempline, cropLine, 0)){    
            dataObj.LBOs.push(new Line(dataObj.BOs[i].midPoint(), findIntersection(LineTempline, cropLine)));
        }else if(checkLine(LineTempline, vLine1, 0)){
            dataObj.LBOs.push(new Line(dataObj.BOs[i].midPoint(), findIntersection(LineTempline, vLine1)));
        }
    }
    createFlakes(); 
}//end createGuides

function checkFlake(fs, tt, l, f){
    let cpp = new Point(0, 0);
    let peakp = f.hexagon.points[0];

    let pl = new Line(f.p1, peakp); 
    //if a branch is to the left of the center line
    if(f.p2.x >= centerP.x){
        //if a branch hits a guid or crop line
        if(checkLines(pl, dataObj.LBOs, 0)){
            peakLine.push(pl);
            peak.push(subPoint(peakp, cpp));
            check.push(true);
            //if brance is not a stem or a seed
            if(f.text !== "stem" && f.text !== "seed"){
                let cl = checkLinesClosest(pl, dataObj.LBOs, 0);
                closest_intersection.push(cl);
                let sp = shortLine(subPoint(f.p1, cpp), cl, f.size2);
                shortPoint.push(sp);
                //if cropping is active
                    let dist = Math.round(findDistance(cl, sp));
                    let cir = new Circle(sp, dist);
                    //if branch start point is below SpaceLines do not add
                    if(rd(f.p1.y) < rd(dataObj.LBOs[2].startPoint.y)){
                        //if branch start point is in the radus or size do not add
                        if(!PinC(cir, f.p1)){
                            let ll = new Line(f.p1, sp);
                            let ff = new Flake(f.p1, sp, f.level, f.size, f.dir, f.text, f.ofs);
                            fs.push(ff);
                            tt.push(ll);
                        }
                    }   
            }else{
                closest_intersection.push(null);
                shortPoint.push(null);
                fs.push(f);
                tt.push(l);
            }
        }else{
            peakLine.push(null);
            peak.push(null);
            check.push(false);
            //if brance is not a stem or a seed
            if(f.text !== "stem" && f.text !== "seed"){
                //if cropping is active
                if(dataObj.crop){
                    //if branch start point is below SpaceLines do not add
                    if(rd(f.p1.y) < rd(dataObj.LBOs[2].startPoint.y)){
                        //if branch start point is in the radus or size do not add
                        fs.push(f);
                        tt.push(l);
                    }   
                }else{
                    fs.push(f);
                    tt.push(l);
                }
            }else{
                closest_intersection.push(null);
                shortPoint.push(null);
                fs.push(f);
                tt.push(l);
            }    
        }
    }
}//end chectFlake


function createFlakes() {
    flakes = [];
    let fs = flakes;
    let b_list = dataObj.BOs;
    idCount = 0;
    shortPoint = [];
    closest_intersection = [];
    check = [];
    peak = [];
    peakLine = [];

    let tas = []; //temp Array Seeds
    let tempTemp = [];
    let size = scale;
    let ang = findDir(centerP, new Point(centerP.x, centerP.y - b_list[0].len));
    ////////////////

    let testline0 = new Line(centerP, new Point(centerP.x, centerP.y - b_list[0].len));
    let test_flake0 = new Flake(centerP, new Point(centerP.x, centerP.y - b_list[0].len), 0,  b_list[0].size, ang, "seed", b_list[0].ofs);
    ////////////////
    checkFlake(fs, tempTemp, testline0, test_flake0);
    ////////////////
    for (let i = 0; i < dataObj.level; i++) {
        if(b_list[i] !== undefined){          
            let bL = b_list[i].len;
            //let bL = 100;
            //float sz = (float)(((Math.random()*(0.1 - 1.5))) + 0.1); 
            //size = sz;
            size = rd(size - ((size / dataObj.level) * i) / 2);
            for(let j=0;j<tas.length;j++){
                let ang = findDir(tas[j].p1, tas[j].p2);
                if (tas[j].p2.x >= centerP.x) {

                    let leftang = ang - 1;
                    if (leftang == -1) {
                        leftang = 5;
                    }
                    let leftT = convert(angList3[leftang], new Point(tas[j].p2.x + bL, tas[j].p2.y), tas[j].p2, tas[j].y2);          
                    let testPoint1 = tas[j].p2;
                    let testline1 = new Line(testPoint1, leftT);
                    let test_flake1 = new Flake(testPoint1, leftT, i, b_list[i].size, leftang, "left", b_list[i].ofs);
                    ////////////////
                    checkFlake(fs, tempTemp, testline1, test_flake1);
                    ////////////////

                    if (rd(tas[j].p2.x) == centerP.x) {
                        let centerang = ang;
                        let centerT = convert(angList3[centerang], new Point(tas[j].p2.x + bL, tas[j].p2.y), tas[j].p2);
                        let testPoint2 = tas[j].p2;
                        let testline2 = new Line(testPoint2, centerT);
                        let test_flake2 = new Flake(testPoint2, centerT, i, b_list[i].size, centerang, "stem", b_list[i].ofs);
                        ////////////////
                        checkFlake(fs, tempTemp, testline2, test_flake2);
                        ////////////////
                    } else {
                        let centerang = ang;
                        let centerT = convert(angList3[centerang], new Point(tas[j].p2.x + bL, tas[j].p2.y), tas[j].p2);
                        let testPoint3 = tas[j].p2;
                        let testline3 = new Line(testPoint3, centerT);
                        let test_flake3 = new Flake(testPoint3, centerT, i, b_list[i].size, centerang, "center", b_list[i].ofs);                        
                        ////////////////
                        checkFlake(fs, tempTemp, testline3, test_flake3);
                        ////////////////
                    }
                    
                    let rightang = ang + 1;
                    if (ang == 5) {
                        rightang = 0;
                    }

                    let rightT = convert(angList3[rightang], new Point(tas[j].p2.x + bL, tas[j].p2.y), tas[j].p2);
                    let testPoint4 = tas[j].p2;
                    let testline4 = new Line(testPoint4, rightT);
                    let test_flake4 = new Flake(testPoint4, rightT, i, b_list[i].size, rightang, "right", b_list[i].ofs);
                    ////////////////////
                    checkFlake(fs, tempTemp, testline4, test_flake4);
                    ///////////////////
                }
            }
        }
            
        tas = tempTemp;
        tempTemp = [];
            
    }//end of loop
    //mirror half
    if(dataObj.mirrorTog){
        mirrorfalkes(fs);
    }

    // rotation sections
    if(dataObj.singleTog){
        createOtherSections(1, fs);
    }else{
        createOtherSections(6, fs);
    }

}//end createFlakes

function mirrorfalkes(fs){
    let tempFlake1 = [];
    for(let i=0;i<fs.length;i++){
        
            let temD = fs[i].dir;
            switch (temD) {
                case 5:
                    temD = 1;
                break;
                case 1:
                    temD = 5;
                break;
                case 4:
                    temD = 2;
                break;
                case 2:
                    temD = 4;
                break;
                default:
                break;
            }
            let text = fs[i].text;
            if(fs[i].text == "right"){
                text = "left";
            }else if(fs[i].text == "left"){
                text = "right";
            }
            if (text !== "seed" && text !== "stem"){
                tempFlake1.push(
                new Flake(
                    new Point(centerP.x - (fs[i].p1.x - centerP.x), fs[i].p1.y),
                    new Point(centerP.x - (fs[i].p2.x - centerP.x), fs[i].p2.y),
                    fs[i].level,
                    fs[i].size,
                    temD,
                    text,
                    fs[i].ofs
                )
            );
        }
    }
    Array.prototype.push.apply(fs, tempFlake1);
    tempFlake1 = [];
}//end mirrorfalkes

function createOtherSections(num, fs){
    let tempFlake = [];
    let tempD;
    //create six sides
    let count = 0;
    for(let n=0;n<fs.length;n++){
        for (let i = 0; i < num; i++) {
            tempD = fs[n].dir + i;
            if (tempD > 5) {
                tempD -= 6;
            }
            let p1 = convert(i * 60, new Point(fs[n].p1.x, fs[n].p1.y), centerP);
            let p2 = convert(i * 60, new Point(fs[n].p2.x, fs[n].p2.y), centerP);
            tempFlake.push(
                new Flake(
                    new Point(p1.x, p1.y),
                    new Point(p2.x, p2.y),
                    fs[n].level,
                    fs[n].size,
                    tempD,
                    fs[n].text,
                    fs[n].ofs
                )
            );
            count++;
         }
    }
    fs = [];
    flakes = tempFlake;
    //Array.prototype.push.apply(fs, tempFlake);
}//end createOtherSections


//Helper functions  //////////////////

function subPoint(p1, p2){
    return new Point(p1.x-p2.x, p1.y-p2.y);
}//end subPoint

function shortLine(sp, ep, size) {
    let angle = findAngel(sp, ep);
    let dist = findDistance(sp, ep);
    let totDist;
    if (size >= dist) {
        totDist = 0;
    } else {
        totDist = dist - size;
    }
    return newPosition(sp, totDist, angle);
}//end shortLine

function findDistance(po1, po2) {
    return Math.sqrt(((po1.x - po2.x) * (po1.x - po2.x)) + ((po1.y - po2.y) * (po1.y - po2.y)));
}//end findDistance

function newPosition(cp, speed, angle) {
    //https://stackoverflow.com/questions/39818833/moving-an-object-from-one-point-to-another
    let x = cp.x + (speed * Math.cos(angle));
    let y = cp.y + (speed * Math.sin(angle));
    return new Point(x, y);
}//end newPosition

function findDir(p1, p2) {
    let direction = 0;
    let rad = findAngel(p1, p2);
    let deg = radians_to_degrees(rad);
    let ang = Math.round(deg);

    for (let i = 0; i < angList3.length; i++) {
        if (ang == angList3[i]) {
            direction = i;
        }
    }
    return direction;
}//end findDir

function radians_to_degrees(radians){
    return radians * (180/Math.PI);
}//end radians_to_degrees


function findAngel(from, to) {
    //https://stackoverflow.com/questions/39818833/moving-an-object-from-one-point-to-another
    let deltaX = to.x - from.x;
    let deltaY = to.y - from.y;
    let angle = Math.atan2(deltaY, deltaX);
    return angle;
}//end findAngel

function checkLine(setmLine, lie2, tol) {
    let intersectionPoint = findIntersection(lie2, setmLine); //Point
    let dx2 = setmLine.p1.x - intersectionPoint.x;
    let dy2 = setmLine.p1.y - intersectionPoint.y;
    let distance2 = Math.abs(Math.sqrt(dx2 * dx2 + dy2 * dy2));
    let tolLine = new Line(new Point(intersectionPoint.x, intersectionPoint.x), new Point(setmLine.p1.x, setmLine.p1.y));
    return intersects(lie2, new Line(new Point(setmLine.p1.x, setmLine.p1.y), new Point(setmLine.p2.x, setmLine.p2.y))) ||
        distance2 < tol / 2 && intersects(tolLine, new Line(new point(lie2.p1.x, lie2.p1.y), new point(lie2.p2.x, lie2.p2.y)));   
}//end checkLine

function checkLines(setmLine, ll, tol) {
    let ret = false;
    for(let i=0;i<ll.length;i++){
        if(checkLine(setmLine, ll[i], tol)){
            ret = true;
        }
    }
    return ret;  
}//end checkLines

function checkLinesClosest(inline, ll, tol) {
    let pl = [];
    for(let i=0;i<ll.length;i++){
        if (checkLine(inline, ll[i], tol)) {
            pl.push(findIntersection(inline, ll[i]));
        }
    }
    let rp = pl[0];
    for(let j=0;j<pl.length;j++){
        if (distance(pl[j], inline.p1) < distance(rp, inline.p1)) {
                rp = pl[j];
        }
    }
    return rp;
}//end checkLinesClosest

function distance(p1, p2){
    let a = p1.x - p2.x;
    let b = p1.y - p2.y;
    return Math.sqrt( a*a + b*b );
}//end distance

function intersects(l1, l2) {
//https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    var det, gamma, lambda;
    det = (l1.p2.x - l1.p1.x) * (l2.p2.y - l2.p1.y) - (l2.p2.x - l2.p1.x) * (l1.p2.y - l1.p1.y);
    if (det === 0) {
        return false;
    } else {
        lambda = ((l2.p2.y - l2.p1.y) * (l2.p2.x - l1.p1.x) + (l2.p1.x - l2.p2.x) * (l2.p2.y - l1.p1.y)) / det;
        gamma = ((l1.p1.y - l1.p2.y) * (l2.p2.x - l1.p1.x) + (l1.p2.x - l1.p1.x) * (l2.p2.y - l1.p1.y)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}//end intersects

function findIntersection(l1, l2) {
        //https://rosettacode.org/wiki/Find_the_intersection_of_two_lines#Java
        let a1 = l1.p2.y - l1.p1.y;
        let b1 = l1.p1.x - l1.p2.x;
        let c1 = a1 * l1.p1.x + b1 * l1.p1.y;

        let a2 = l2.p2.y - l2.p1.y;
        let b2 = l2.p1.x - l2.p2.x;
        let c2 = a2 * l2.p1.x + b2 * l2.p1.y;

        let delta = a1 * b2 - a2 * b1;
        let ret = new Point((b2 * c1 - b1 * c2) / delta, (a1 * c2 - a2 * c1) / delta);
        if (((b2 * c1 - b1 * c2) / delta) == 0) {
            ret = new Point(0, 0);
        }
        return ret;    
}//end findIntersection

function PinC(c, p){
    return (((p.x - c.p.x) * (p.x - c.p.x)) + ((p.y - c.p.y) * (p.y - c.p.y)) <= (c.r * c.r));
}//end PinC

function convert(ang, xy, cxy) {    
    let p1 = cxy.x + Math.cos(ang * Math.PI / 180) * (xy.x - cxy.x) - Math.sin(ang * Math.PI / 180) * (xy.y - cxy.y);
    let p2 = cxy.y + Math.sin(ang * Math.PI / 180) * (xy.x - cxy.x) + Math.cos(ang * Math.PI / 180) * (xy.y - cxy.y);
    return new Point( p1, p2);   
}//end convert


});