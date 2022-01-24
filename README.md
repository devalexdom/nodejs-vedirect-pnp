# victron-vedirect-pnp
A plug and play way to easily read data from your connected Victron VE.Direct devices

## Usage
1. Connect your Victron device using the VE.Direct USB interface to your Raspberry or Linux x86-64 based computer
2. npm i @devalexdom/victron-vedirect-pnp
3. Run:
```javascript
const VEDirectPnP = require("@devalexdom/victron-vedirect-pnp");
const dataReader = new VEDirectPnP();
dataReader.on("data-ready", () => {
  console.log(dataReader.getDevicesData());
  /*{
    "HQ21340EFYE": {
        "deviceName": "SmartSolar MPPT 100|50",
        "deviceSN": "HQ21340EFYE",
        "deviceType": "MPPT",
        "deviceFirmwareVersion": 1.59,
        "batteryVoltage": 25.47,
        "batteryCurrent": 0,
        "statusMessage": "Off",
        "errorMessage": "",
        "mpptMessage": "Off",
        "maximumPowerToday": 0,
        "maximumPowerYesterday": 835,
        "totalEnergyProduced": 128.42,
        "energyProducedToday": 0,
        "energyProducedYesterday": 3.55,
        "photovoltaicPower": 0,
        "photovoltaicVoltage": 0.15,
        ...
    */
});
```
4. And start making great green things 🌱🌍!



## A more detailed usage

```javascript
const VEDirectPnP = require("@devalexdom/victron-vedirect-pnp");
const dataReader = new VEDirectPnP({ veDirectDevicesPath: "/dev/serial/by-id/" }); //Optional parameter to set the directory path of the VE.Direct USB interfaces
dataReader.on("data-ready", () => {
        const allDevicesData = dataReader.getDevicesData();
        console.log(allDevicesData["HQ21340EFYE"]);
        /* If your device serial number is HQ21340EFYE the expected output will be:
        {
            deviceName: 'SmartSolar MPPT 100|50',
            deviceSN: 'HQ21340EFYE',
            deviceType: 'MPPT',
            deviceFirmwareVersion: 1.59,
            batteryVoltage: 25.49, //Volts
            batteryCurrent: 0, //Amps
            statusMessage: 'Off',
            errorMessage: '',
            mpptMessage: 'Off',
            maximumPowerToday: 835, //Watts
            maximumPowerYesterday: 837, //Watts
            totalEnergyProduced: 128.42, //kWh
            energyProducedToday: 3.55, //kWh
            energyProducedYesterday: 3.63, //kWh
            photovoltaicPower: 0, //Watts
            photovoltaicVoltage: 0.82, //Volts
            photovoltaicCurrent: 0, //Amps
            loadCurrent: 0, //Amps
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

//Handling errors
dataReader.on("error", (error) => {
    console.error(error);
})
```

### Pending things to code

1. Victron Phoenix Inverters data mapping
2. Victron BMV data mapping
3. Victron Phoenix Charger data mapping
4. Kill the bugs

### Related
VE.Direct protocol [documentation](https://www.atakale.com.tr/image/catalog/urunler/charger/victron/pdf/victron_energy_haberlesme_protokolu_VE.Direct-Protocol-3.29.pdf).

### Credits
VE.Direct parser [@bencevans/ve.direct](https://github.com/bencevans/ve.direct).