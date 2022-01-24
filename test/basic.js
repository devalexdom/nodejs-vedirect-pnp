const VEDirectPnP = require("../dist/index");

const dataReader = new VEDirectPnP();

dataReader.on("data-ready", () => {
    setInterval(() => {
        const allDevicesData = dataReader.getDevicesData();
        console.log(allDevicesData["HQ21340EFYE"]);
        /* If your device serial number is HQ21340EFYE the expected output will be (TypeScript):
        VEDirectPnP_MPPTDeviceData {
            deviceName: 'SmartSolar MPPT 100|50',
            deviceSN: 'HQ21340EFYE',
            deviceType: 'MPPT',
            deviceFirmwareVersion: 1.59,
            batteryVoltage: 25.49,
            batteryCurrent: 0,
            statusMessage: 'Off',
            errorMessage: '',
            mpptMessage: 'Off',
            maximumPowerToday: 835,
            totalEnergyProduced: 128.42,
            energyProducedToday: 3.55,
            energyProducedYesterday: 3.63,
            photovoltaicPower: 0,
            photovoltaicVoltage: 0.82,
            photovoltaicCurrent: 0,
            loadCurrent: 0,
            loadOutputState: true,
            relayState: false,
            offReasonMessage: 'No input power',
            daySequenceNumber: 142,
            VEDirectData: {
                PID: 41047,
                FW: 159,
                'SER#': 'HQ21340EFYE',
                V: 25490,
                I: 0,
                VPV: 820,
                PPV: 0,
                CS: 0,
                MPPT: 0,
                OR: 1,
                ERR: 0,
                LOAD: 'ON',
                H19: 12842,
                H20: 355,
                H21: 835,
                H22: 363,
                H23: 837,
                HSDS: 142,
                dataTimeStamp: 2022-01-23T21:11:06.910Z
            }
        }
        */
    }, 1000);
})

dataReader.on("error", (error) => {
    console.error(error);
})