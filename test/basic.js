const VEDirectPnP = require("../dist/index");
const dataReader = new VEDirectPnP();

const readData = () => {
    setInterval(() => {
        console.log(dataReader.getDevicesData());
    }, 2000);
}
dataReader.on("all", (eventData) => {
    console.log(eventData);
});

dataReader.on("stream-init", () => {
    readData();
});

dataReader.on("error", (error) => {
    console.error(error);
    /*
      {
        message: string;
        dataDump: any;
      }
    */
})

setInterval(() => {
    console.log(dataReader.reset());
}, 10000);

/*
dataReader.on("stream-init", () => {
    setInterval(() => {
        const allDevicesData = dataReader.getDevicesData();
        console.log(allDevicesData["HQ21340EFYE"]);
        /* If your device serial number is HQ21340EFYE the expected output will be (TypeScript):
        VEDirectPnP_MPPTDeviceData {
            deviceName: 'SmartSolar MPPT 100|50',
            deviceSN: 'HQ21340EFYE',
            deviceType: 'MPPT',
            deviceFirmwareVersion: 1.59,
            batteryVoltage: 24.73,
            batteryCurrent: 0,
            statusMessage: 'Off',
            errorMessage: '',
            mpptMessage: 'Off',
            maximumPowerToday: 909,
            maximumPowerYesterday: 835,
            totalEnergyProduced: 131.46,
            energyProducedToday: 3.04,
            energyProducedYesterday: 3.55,
            photovoltaicPower: 0,
            photovoltaicVoltage: 2.57,
            photovoltaicCurrent: 0,
            loadCurrent: 0,
            loadOutputState: true,
            relayState: false,
            offReasonMessage: 'No input power',
            daySequenceNumber: 143,
            VEDirectData: VEDirectData {
                PID: 41047,
                FW: 159,
                'SER#': 'HQ21340EFYE',
                V: 24730,
                I: 0,
                VPV: 2570,
                PPV: 0,
                CS: 0,
                MPPT: 0,
                OR: 1,
                ERR: 0,
                LOAD: 'ON',
                H19: 13146,
                H20: 304,
                H21: 909,
                H22: 355,
                H23: 835,
                HSDS: 143,
                dataTimeStamp: 1643058077196
            }
        }
        *//*
}, 1000);
})*/