declare const Buffer; //To silence TypeScript bug? in Buffer.from(-->[0x0d, 0x0a]<--) Maybe I gonna need some help here...

import { exec } from "child_process";
import { VEDirectParser } from "./ve-direct";
import SerialPort from "serialport";
import { VEDirectPnP_MPPTDeviceData, VEDirectPnP_UnsupportedDeviceData } from "./device-data";


interface IVEDirectPnP_Parameters {
  veDirectDevicesPath?: string;
  fluidMode?: boolean;
}

interface IVEDirectPnP_EventData {
  message?: String,
  dataDump?: any
}


export default class VEDirectPnP {
  version: number;
  parameters: IVEDirectPnP_Parameters;
  currentEvent: string;
  listenersStack: Array<Function>;
  devicesVEDirectData: { [key: string]: Object }
  serialPorts: Array<SerialPort>;
  fluidModeReady: boolean;
  constructor({ veDirectDevicesPath = "/dev/serial/by-id/" } = {}) {
    this.version = 0.02;
    this.parameters = {
      veDirectDevicesPath: veDirectDevicesPath,
    };
    this.listenersStack = [];
    this.devicesVEDirectData = {};
    this.serialPorts = [];
    this.fluidModeReady = false;
    this.init();
  }

  on(event: string, callback: Function): void {
    const listener = (eventEmmited: string, eventData?: IVEDirectPnP_EventData) => {
      if (event === eventEmmited) {
        callback(eventData);
      }
    }
    this.listenersStack.push(listener);
  }

  emitEvent(event: string, eventData?: IVEDirectPnP_EventData) {
    for (const listener of this.listenersStack) {
      listener(event, eventData);
    }
  }

  getVictronDeviceSN(VEDirectData: Object) {
    return VEDirectData["SER#"];
  }

  mapVictronDeviceData(devicesData: { [key: string]: Object }) {
    const devicesDataMapped = {};
    for (const deviceSN in devicesData) {
      const deviceData = devicesData[deviceSN];
      if (!isNaN(deviceData["MPPT"])) {
        devicesDataMapped[deviceSN] = new VEDirectPnP_MPPTDeviceData(deviceData);
      }
      else {
        devicesDataMapped[deviceSN] = new VEDirectPnP_UnsupportedDeviceData(deviceData);
      }
    }
    return devicesDataMapped;
  }

  init() {
    this.initVEDirectDataFlowFromAllDevices().then(() => {
      this.emitEvent("data-ready");
    }).catch((error) => {
      this.emitEvent("error", {
        message: error
      });
    });
  }

  stop() {
    for (const serialPort of this.serialPorts) {
      serialPort.close();
    }
  }

  getDevicesData() {
    return this.mapVictronDeviceData(this.devicesVEDirectData);
  }

  updateVEDirectDataDeviceData(VEDirectRawData) {
    const serialNumber = this.getVictronDeviceSN(VEDirectRawData);
    if (!serialNumber) {
      this.emitEvent("error", {
        message: "Device does not have a valid serial number.",
        dataDump: VEDirectRawData
      });
      return;
    }
    this.devicesVEDirectData = {
      ...this.devicesVEDirectData,
      [serialNumber]: {
        ...VEDirectRawData, ...{ dataTimeStamp: new Date().getTime() }
      }
    };
  }

  getVEDirectDevicesAvailable() {
    return new Promise<Array<string> | string>((resolve, reject) => {
      exec(`ls ${this.parameters.veDirectDevicesPath}`, (error, stdout, stderr) => {
        if (error) {
          reject(error.message);
        }
        if (stderr) {
          reject(stderr);
        }
        const rawResponse = stdout.split('\n');
        rawResponse.pop();
        const absoluteDevicesPath = rawResponse.map((device) => {
          return this.parameters.veDirectDevicesPath + device;
        });
        resolve(absoluteDevicesPath);
      });
    });
  }

  initVEDirectDataFlowFromAllDevices() {
    return new Promise((resolve, reject) => {
      const devicesPromises = [];
      this.getVEDirectDevicesAvailable().then((devices) => {
        for (const device of devices) {
          devicesPromises.push(this.initDataFlowFromVEDirect(device));
        }
        Promise.all(devicesPromises).then(() => {
          resolve(true);
        }, error => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  initDataFlowFromVEDirect(devicePath) {
    return new Promise((resolve, reject) => {
      const port = new SerialPort(devicePath, {
        baudRate: 19200,
        dataBits: 8,
        parity: 'none'
      }, (err) => {
        if (err) {
          this.emitEvent("error", {
            message: `Device ${devicePath} serial port error`,
            dataDump: err
          });
          this.devicesVEDirectData = {};
          reject(err);
        }
      });

      this.serialPorts.push(port);

      const delimiter = new SerialPort.parsers.Delimiter({
        delimiter: Buffer.from([0x0d, 0x0a], 'hex'),
        includeDelimiter: false
      });

      const VEDParser = new VEDirectParser();
      port.pipe(delimiter).pipe(VEDParser);

      VEDParser.on("data", (VEDirectRawData) => {
        if (!this.devicesVEDirectData[this.getVictronDeviceSN(VEDirectRawData)]) {
          resolve(true);
        }
        this.updateVEDirectDataDeviceData(VEDirectRawData);
      });
    });
  }
}



