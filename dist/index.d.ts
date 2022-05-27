import SerialPort from "serialport";
import { IVEDirectPnP_DeviceData } from "./device-data";
interface IVEDirectPnP_Parameters {
    VEDirectDevicesPath?: string;
    customVEDirectDevicesPaths?: Array<string>;
    fallbackSerialNumber?: any;
}
interface IVEDirectPnP_EventData {
    message?: string;
    dataDump?: any;
    eventName?: string;
}
export default class VEDirectPnP {
    version: number;
    parameters: IVEDirectPnP_Parameters;
    currentEvent: string;
    listenersStack: Array<Function>;
    devicesVEDirectData: {
        [key: string]: Object;
    };
    serialPorts: Array<SerialPort>;
    fluidModeReady: boolean;
    constructor({ VEDirectDevicesPath, customVEDirectDevicesPaths, fallbackSerialNumber }?: {
        VEDirectDevicesPath?: string;
        customVEDirectDevicesPaths?: any[];
        fallbackSerialNumber?: boolean;
    });
    on(event: string, callback: Function): void;
    emitEvent(event: string, eventData?: IVEDirectPnP_EventData): void;
    getVictronDeviceSN(VEDirectData: Object): any;
    mapVictronDeviceData(devicesData: {
        [key: string]: Object;
    }): {
        [key: string]: IVEDirectPnP_DeviceData;
    };
    init(): void;
    clean(): void;
    reset(): void;
    closeSerialPorts(): Promise<void>;
    destroy(callback?: Function): void;
    getDevicesData(): {
        [key: string]: IVEDirectPnP_DeviceData;
    };
    updateVEDirectDataDeviceData(VEDirectRawData: any): void;
    getVEDirectDevicesAvailable(): Promise<string[]>;
    initVEDirectDataStreamFromAllDevices(): Promise<void>;
    initDataStreamFromVEDirect(devicePath: any): Promise<void>;
}
export {};
