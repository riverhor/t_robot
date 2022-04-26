/// <reference types="web-bluetooth" />
export default class bluetooth{

readonly serviceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
readonly characteristicsUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
device:BluetoothDevice
characteristics : BluetoothRemoteGATTCharacteristic


constructor() {
   
    this.device = {} as any;
    this.characteristics = {} as any;
}
 
async onConnectClick() {

    try {
      console.log('Requesting Bluetooth Device...');
  
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{services: [this.serviceUUID]}]});
  
      console.log('> Name:             ' + this.device.name);
      console.log('> Id:               ' + this.device.id);
      const server = await this.device.gatt?.connect();
      console.log(server)
      const service = await server?.getPrimaryService(this.serviceUUID);
      console.log(service)
      const characteristics = await service?.getCharacteristic(this.characteristicsUUID);
      (characteristics!=undefined) ? this.characteristics= characteristics : null
      console.log(this.characteristics)
      let myDescriptor = await this.characteristics.getDescriptors()
      console.log(myDescriptor)  

    } catch(error)  {
      console.log('Argh! ' + error);
    }
  }
async onRunClick() {
    var runcommand = new ArrayBuffer(20)
    var int8 = new Uint8Array(runcommand)
    int8[0] = (3<<4) +6
    for (let i=1;i<19 ;i++) 
        int8[i] = 0
    try {
        this.characteristics.writeValueWithoutResponse(runcommand)
    } catch(error)  {
      console.log('Argh! ' + error);
    }
  }

}