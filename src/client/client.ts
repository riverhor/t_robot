import * as THREE from 'three'
import Bluetooth from './bluetooth'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import './css/global.css';

import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
/*scene.add(new THREE.AxesHelper(5))*/

let bluetooth = new Bluetooth();

const light = new THREE.PointLight(0xffffff, 1)
light.position.set(2.5, 50, 15)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,//視角遠近
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = -2
camera.position.y = 2


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', render)
const geometry = new THREE.BoxGeometry()
controls.enableDamping = true
controls.screenSpacePanning = true
var mapnumber = 0
//背景
function Skybox() {
    const materialArray = []
    const ft = new THREE.TextureLoader().load('img/bk/ft.jpg')
    const bk = new THREE.TextureLoader().load('img/bk/bk.jpg')
    const up = new THREE.TextureLoader().load('img/bk/up.jpg')
    const dn = new THREE.TextureLoader().load('img/bk/dn.jpg')
    const rt = new THREE.TextureLoader().load('img/bk/rt.jpg')
    const lf = new THREE.TextureLoader().load('img/bk/lf.jpg')

    materialArray.push(new THREE.MeshBasicMaterial({ map: ft, side: THREE.DoubleSide }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: bk, side: THREE.DoubleSide }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: up, side: THREE.DoubleSide }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: dn, side: THREE.DoubleSide }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: rt, side: THREE.DoubleSide }))
    materialArray.push(new THREE.MeshBasicMaterial({ map: lf, side: THREE.DoubleSide }))
    const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000)
    const skybox = new THREE.Mesh(skyboxGeo, materialArray)
    scene.add(skybox)
}
const planeGeometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.MeshPhongMaterial()
const textureLoader = new THREE.TextureLoader()

const tmp0 = textureLoader.load('img/robotmap0.jpg')
const tmp1 = textureLoader.load('img/robotmap1.jpg')
const tmp2 = textureLoader.load('img/robotmap2.jpg')
let tmp = tmp0
function robotmap() {
    
    switch(mapnumber){
        case 0:
            tmp = tmp0
          
            break;
        case 1:
            tmp = tmp1
           
            break;
        case 2:
            tmp = tmp2
            break;
    }
    //圖片都要轉180度
    material.map = tmp
    let plane = new THREE.Mesh(planeGeometry, material)
    plane.rotation.x = -0.5 * Math.PI

    

    scene.add(plane)
}
//背景END
//(A1: x=0.7,y=0,z=-0.7)
//X是左右(每格中心大概隔0.47)(負的往右，正的往左)
var robotx =0.7
//Y是上下(盡量別改，就是0)
var roboty =0
//Z是前後(每格中心大概隔0.47)(正的往前，負的往後)
var robotz =-0.7
function robot() {
    const progressBar = document.getElementById('progressBar')
    const objLoader = new OBJLoader()
    objLoader.load(
        'models/robot.obj',
        (object) => {
            // (object.children[0] as THREE.Mesh).material = material
            // object.traverse(function (child) {
            //     if ((child as THREE.Mesh).isMesh) {
            //         (child as THREE.Mesh).material = material
            //     }
            // })
            progressBar!.style.display = 'none'
            object.position.set(robotx,roboty,robotz)
            scene.add(object)
            document.addEventListener("keydown",onDocumentKeyDown,false);
            function onDocumentKeyDown(event:{which:any;}){
                var keyCode =event.which;
                if(keyCode==87&&object.position.z<=1){//前 超過z=1就停
                    object.position.z+=0.01;   
                }
                else if(keyCode==83&&object.position.z>=-1){//後 超過z=-1就停
                    object.position.z-=0.01;
                }
                else if(keyCode==65&&object.position.x<=1){//左 超過x=1就停
                    object.position.x+=0.01
                }
                else if(keyCode==68&&object.position.x>=-1){//右 超郭x=-1就停
                    object.position.x-=0.01
                }
                render();
            }
            
        },
        (xhr) => {
            /*var percentComplete = (xhr.loaded / xhr.total) * 100
            console.log(percentComplete);
            (<HTMLInputElement>document.getElementById('progressBar')).value = percentComplete.toString();*/
            progressBar!.style.display = 'aa'
        },
        (error) => {
            console.log(error)
        }
    )
}
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

//地圖
var datText ={ 
    "mapSetting" : ['map1', 'map2', 'map3']
}

var datGuiSetting = {
    Map: "map1",
    CONNECT : function(){ bluetooth.onConnectClick() },
    RUN : function(){ bluetooth.onRunClick() }
}

const gui = new GUI()

///藍芽組專用
const subGui = gui.addFolder('藍芽控制')
subGui.add(datGuiSetting, 'CONNECT' )
subGui.add(datGuiSetting, 'RUN' )


///
gui.add(datGuiSetting, 'Map', datText.mapSetting).onChange(mapchange)
const stats = Stats()
document.body.appendChild(stats.dom)
function animate() {
    requestAnimationFrame(animate)
    render()

    stats.update()
}

function render() { 
    renderer.render(scene, camera)
}
function mapchange(){
    switch(datGuiSetting.Map){
        case 'map1':
            mapnumber=0
            break;
        case 'map2':
            mapnumber=1
            break;
        case 'map3':
            mapnumber=2
            break;
    }
   robotmap()
}


Skybox()
robotmap()
robot()
animate()
