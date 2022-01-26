# victron-vedirect-pnp
A plug and play way to easily read data from your connected Victron VE.Direct devices

## Changelog
```
0.0.6: [Feature]
--Added all methods, constructor parameters and events documentation on README.md
-
0.0.5: [Feature breaking changes!] 
--Improved events naming, types and listener
--Implement reset functionality
--Implement custom VE.Direct devices paths constructor parameter
-
0.0.4: [Hotfix]
--Fixes incorrect identification of VE.Direct serial port interfaces
```

## Usage
1. Connect your Victron device using the VE.Direct USB interface to your Raspberry or Linux x86-64 based computer

2. `npm i @devalexdom/victron-vedirect-pnp`

3. Run:
```javascript
const VEDirectPnP = require("@devalexdom/victron-vedirect-pnp");
const dataReader = new VEDirectPnP();
dataReader.on("stream-init", () => {
  console.log(dataReader.getDevicesData());
  /*{
    "HQ21340EFYE": {
        "deviceName": "SmartSolar MPPT 100|50",
        "deviceSN": "HQ21340EFYE",
        "deviceType": "MPPT",
        "deviceFirmwareVersion": 1.59,
        "batteryVoltage": 28.32,
        "batteryCurrent": 21.2,
        "statusMessage": "Absorption",
        "errorMessage": "",
        "mpptMessage": "Voltage or current limited",
        "maximumPowerToday": 909,
        "maximumPowerYesterday": 835,
        "totalEnergyProduced": 130.4,
        "energyProducedToday": 1.98,
        "energyProducedYesterday": 3.55,
        "photovoltaicPower": 608,
        "photovoltaicVoltage": 37.32,
        "photovoltaicCurrent": 16.291532690246516,
        ...
    */
});
```

4. And start making great green things 🌱🌍!

---
---
---

## A more detailed usage

```javascript
const VEDirectPnP = require("@devalexdom/victron-vedirect-pnp");
const dataReader = new VEDirectPnP({ veDirectDevicesPath: "/dev/serial/by-id/" }); //Optional parameter to set the directory path of the VE.Direct USB interfaces
dataReader.on("stream-init", () => {
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
                dataTimeStamp: 1643058077196
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

## Constructor parameters
### Optional VEDirectDevicesPath?: string
By default "/dev/serial/by-id/", the path where the VE.Direct interfaces will be searched
### Optional customVEDirectDevicesPaths?: Array<string>
Manually sets the VE.Direct interfaces paths
```javascript
new VEDirectPnP({
    veDirectDevicesPath: "/dev/serial/by-id/", 
    customVEDirectDevicesPaths: ["/dev/serial/by-id/usb-VictronEnergy_BV_VE_Direct_cable_VE83Y8X8-if00-port0"]
});
```

## Methods
### getDevicesData():{ [key: string]: IVEDirectPnP_DeviceData }
Returns a key -> value, the key is the serial number of the Victron device, value the processed stream data
```javascript
const dataReader = new VEDirectPnP();
dataReader.on("interface-found", (eventData) => {
    /*
    eventData: IVEDirectPnP_EventData
    {
        message: string;
        dataDump: any;
        eventName: string;
    }
    */
})
```
### on(eventName:string, callback:eventData):void
Listen to VEDirectPnP events
```javascript
const dataReader = new VEDirectPnP();
dataReader.on("interface-found", (eventData) => {
    /*
    eventData: IVEDirectPnP_EventData
    {
        message: string;
        dataDump: any;
        eventName: string;
    }
    */
})
```
With the "all" wildcard the listener will fire with all events
```javascript
const dataReader = new VEDirectPnP();
dataReader.on("all", console.log);
/*
{
  message: 'Found VE.Direct serial port interface',
  dataDump: '/dev/serial/by-id/usb-VictronEnergy_BV_VE_Direct_cable_VE83Y8X8-if00-port0',
  eventName: 'interface-found'
}
{
  message: 'VE.Direct device connected through serial port',
  dataDump: '/dev/serial/by-id/usb-VictronEnergy_BV_VE_Direct_cable_VE83Y8X8-if00-port0',
  eventName: 'device-connection-open'
}
{
  message: 'VE.Direct devices data stream init',
  eventName: 'stream-init'
}

*/
```
### destroy(callback:void):void
Destroys the data stream from VE.Direct devices
```javascript
const dataReader = new VEDirectPnP();
dataReader.destroy(()=>{
    //callback when data stream is destroyed (All serial ports connection closed)
});
```
### reset():void
Resets the data stream from VE.Direct devices
```javascript
const dataReader = new VEDirectPnP();
dataReader.reset(); //Be aware that the event "stream-init" will be emitted again
```
### clean():void
Cleans the cached data from VE.Direct devices stream
```javascript
const dataReader = new VEDirectPnP();
dataReader.reset();
```
### init():void
Initializes the data stream from VE.Direct devices
```javascript
const dataReader = new VEDirectPnP();
dataReader.init(); //Initializes data stream from VE.Direct devices (Called on VEDirectPnP constructor)
```
## Events
### stream-init
Emitted when the VE.Direct devices starts sending data through serial port
### stream-destroy
Emitted when the VE.Direct devices stream has been destroyed (All serial ports connection closed)
### error
Emitted when a critical error occurs with a (hopelly) helpful message
### interface-found
Emitted when a VE.Direct interface is automatically detected (The plug and play way)
### device-connection-open
Emitted when a connection to the VE.Direct device is opened
### device-connection-error
Emitted when a connection to the VE.Direct device suffers an error
```javascript
const dataReader = new VEDirectPnP();
dataReader.on("device-connection-error", () => {
    setTimeout(() => {
        dataReader.reset();
    }, 5000);
});//Example to reestablish a lost connection, it's not tested but should do the trick ;)
```

## Pending things to code

1. Victron Phoenix Inverters data mapping
2. Victron BMV data mapping
3. Victron Phoenix Charger data mapping
4. Kill the bugs

## Related
VE.Direct protocol 3.29 [documentation](docs/victron_energy_VE.Direct-Protocol-3.29.pdf).

## Credits
VE.Direct parser using Stream interface [@bencevans/ve.direct](https://github.com/bencevans/ve.direct).
