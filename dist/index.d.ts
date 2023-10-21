import { MPPTDeviceData, VEDirectPnPDeviceData, BMVDeviceData } from "./device-data";
interface VEDirectPnPDeviceRelations {
    mainBatteryDeviceId?: string;
    mainMPPTDeviceId?: string;
    mainInverterDeviceId?: string;
    mainChargerDeviceId?: string;
}
export default class VEDirectPnP {
    #private;
    constructor({ VEDirectDevicesPath, customVEDirectDevicesPaths }?: {
        VEDirectDevicesPath?: string;
        customVEDirectDevicesPaths?: any[];
    }, deviceRelations?: VEDirectPnPDeviceRelations);
    init(): void;
    on(event: string, callback: Function): void;
    getVersion(): number;
    destroy(callback?: Function): void;
    getDevicesData(): {
        [key: string]: VEDirectPnPDeviceData;
    };
    getBatteriesData(): VEDirectPnPDeviceData[];
    getBatteryData(deviceId?: string): BMVDeviceData;
    getMPPTData(deviceId?: string): MPPTDeviceData;
    getInvertersData(): VEDirectPnPDeviceData[];
    getChargersData(): VEDirectPnPDeviceData[];
    getMPPTsData(): VEDirectPnPDeviceData[];
    getDevicesDataByType(deviceType: string): VEDirectPnPDeviceData[];
    reset(): void;
}
export {};
