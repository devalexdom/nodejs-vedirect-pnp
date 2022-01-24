import SerialPort from "serialport";
interface IVEDirectPnP_Parameters {
    veDirectDevicesPath?: string;
    fluidMode?: boolean;
}
interface IVEDirectPnP_EventData {
    message?: String;
    dataDump?: any;
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
    constructor({ veDirectDevicesPath }?: {
        veDirectDevicesPath?: string;
    });
    on(event: string, callback: Function): void;
    emitEvent(event: string, eventData?: IVEDirectPnP_EventData): void;
    getVictronDeviceSN(VEDirectData: Object): any;
    mapVictronDeviceData(devicesData: {
        [key: string]: Object;
    }): {};
    init(): void;
    stop(): void;
    getDevicesData(): {};
    updateVEDirectDataDeviceData(VEDirectRawData: any): void;
    getVEDirectDevicesAvailable(): Promise<string | string[]>;
    initVEDirectDataFlowFromAllDevices(): Promise<unknown>;
    initDataFlowFromVEDirect(devicePath: any): Promise<unknown>;
}
export {};
