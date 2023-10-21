'use strict';

var child_process = require('child_process');
var stream = require('stream');
var SerialPort = require('serialport');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var SerialPort__default = /*#__PURE__*/_interopDefaultLegacy(SerialPort);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

class VEDirectData {
  constructor(VEDirectRawData) {
    for (const key in VEDirectRawData) {
      if (isNaN(VEDirectRawData[key])) {
        this[key] = VEDirectRawData[key];
      } else {
        this[key] = parseInt(VEDirectRawData[key]);
      }
    }
  }

}
class VEDirectParser extends stream.Transform {
  constructor() {
    super({
      readableObjectMode: true
    });
    this.buffer = Buffer.alloc(0);
    this.rawDataBlock = {};
  }

  isChecksumValid() {
    return this.buffer.reduce((prev, curr) => prev + curr & 255, 0) === 0;
  }

  _transform(dataChunk, encoding, callback) {
    const [key, value] = dataChunk.toString().split('\t');

    if (key[0] === ':') {
      callback();
      return;
    }

    this.buffer = Buffer.concat([this.buffer, Buffer.from([0x0d, 0x0a]), dataChunk]);

    if (key === "Checksum") {
      if (this.isChecksumValid()) {
        this.push(this.rawDataBlock);
      }

      this.buffer = Buffer.alloc(0);
      this.rawDataBlock = {};
    } else {
      this.rawDataBlock[key] = value;
    }

    callback();
  }

}

const deviceName = {
  768: "BlueSolar MPPT 70|15",
  41087: "All-In-1 SmartSolar MPPT 75/15 12V",
  41024: "BlueSolar MPPT 75|50",
  41025: "BlueSolar MPPT 150|35",
  41026: "BlueSolar MPPT 75|15",
  41027: "BlueSolar MPPT 100|15",
  41028: "BlueSolar MPPT 100|30",
  41029: "BlueSolar MPPT 100|50",
  41030: "BlueSolar MPPT 150|70",
  41031: "BlueSolar MPPT 150|100",
  41033: "BlueSolar MPPT 100|50 rev2",
  41034: "BlueSolar MPPT 100|30 rev2",
  41035: "BlueSolar MPPT 150|35 rev2",
  41036: "BlueSolar MPPT 75|10",
  41037: "BlueSolar MPPT 150|45",
  41074: "BlueSolar MPPT 150/45 rev3",
  41038: "BlueSolar MPPT 150|60",
  41039: "BlueSolar MPPT 150|85",
  41040: "SmartSolar MPPT 250|100",
  41041: "SmartSolar MPPT 150|100",
  41042: "SmartSolar MPPT 150|85",
  41043: "SmartSolar MPPT 75|15",
  41044: "SmartSolar MPPT 75|10",
  41045: "SmartSolar MPPT 100|15",
  41046: "SmartSolar MPPT 100|30",
  41047: "SmartSolar MPPT 100|50",
  41048: "SmartSolar MPPT 150|35",
  41049: "SmartSolar MPPT 150|100 rev2",
  41050: "SmartSolar MPPT 150|85 rev2",
  41051: "SmartSolar MPPT 250|70",
  41052: "SmartSolar MPPT 250|85",
  41053: "SmartSolar MPPT 250|60",
  41054: "SmartSolar MPPT 250|45",
  41055: "SmartSolar MPPT 100|20",
  41056: "SmartSolar MPPT 100|20 48V",
  41057: "SmartSolar MPPT 150|45",
  41058: "SmartSolar MPPT 150|60",
  41059: "SmartSolar MPPT 150|70",
  41060: "SmartSolar MPPT 250|85 rev2",
  41061: "SmartSolar MPPT 250|100 rev2",
  41062: "BlueSolar MPPT 100|20",
  41063: "BlueSolar MPPT 100|20 48V",
  41064: "SmartSolar MPPT 250|60 rev2",
  41065: "SmartSolar MPPT 250|70 rev2",
  41066: "SmartSolar MPPT 150|45 rev2",
  41067: "SmartSolar MPPT 150|60 rev2",
  41068: "SmartSolar MPPT 150|70 rev2",
  41069: "SmartSolar MPPT 150|85 rev3",
  41070: "SmartSolar MPPT 150|100 rev3",
  41071: "BlueSolar MPPT 150|45 rev2",
  41072: "BlueSolar MPPT 150|60 rev2",
  41073: "BlueSolar MPPT 150|70 rev2",
  41075: "SmartSolar MPPT 150/45 rev3",
  41218: "SmartSolar MPPT VE.Can 150/70",
  41219: "SmartSolar MPPT VE.Can 150/45",
  41220: "SmartSolar MPPT VE.Can 150/60",
  41221: "SmartSolar MPPT VE.Can 150/85",
  41222: "SmartSolar MPPT VE.Can 150/100",
  41223: "SmartSolar MPPT VE.Can 250/45",
  41224: "SmartSolar MPPT VE.Can 250/60",
  41225: "SmartSolar MPPT VE.Can 250/70",
  41226: "SmartSolar MPPT VE.Can 250/85",
  41227: "SmartSolar MPPT VE.Can 250/100",
  41228: "SmartSolar MPPT VE.Can 150/70 rev2",
  41229: "SmartSolar MPPT VE.Can 150/85 rev2",
  41230: "SmartSolar MPPT VE.Can 150/100 rev2",
  41231: "BlueSolar MPPT VE.Can 150/100",
  41234: "BlueSolar MPPT VE.Can 250/70",
  41235: "BlueSolar MPPT VE.Can 250/100",
  41236: "SmartSolar MPPT VE.Can 250/70 rev2",
  41237: "SmartSolar MPPT VE.Can 250/100 rev2",
  41238: "SmartSolar MPPT VE.Can 250/85 rev2",
  41239: "BlueSolar MPPT VE.Can 150/100 rev2",
  41968: "Smart BuckBoost 12V/12V-50A",
  41865: "SmartShunt 500A/50mV",
  41866: "SmartShunt 1000A/50mV",
  41867: "SmartShunt 2000A/50mV",
  41857: "BMV-712 Smart",
  41858: "BMV-710H Smart",
  41859: "BMV-712 Smart Rev2"
};

var StatusMessage;

(function (StatusMessage) {
  StatusMessage[StatusMessage["Off"] = 0] = "Off";
  StatusMessage[StatusMessage["Low power"] = 1] = "Low power";
  StatusMessage[StatusMessage["Fault"] = 2] = "Fault";
  StatusMessage[StatusMessage["Bulk"] = 3] = "Bulk";
  StatusMessage[StatusMessage["Absorption"] = 4] = "Absorption";
  StatusMessage[StatusMessage["Float"] = 5] = "Float";
  StatusMessage[StatusMessage["Storage"] = 6] = "Storage";
  StatusMessage[StatusMessage["Equalize (manual)"] = 7] = "Equalize (manual)";
  StatusMessage[StatusMessage["Inverting"] = 9] = "Inverting";
  StatusMessage[StatusMessage["Power supply"] = 11] = "Power supply";
  StatusMessage[StatusMessage["Starting-up"] = 245] = "Starting-up";
  StatusMessage[StatusMessage["Repeated absorption"] = 246] = "Repeated absorption";
  StatusMessage[StatusMessage["Auto equalize / Recondition"] = 247] = "Auto equalize / Recondition";
  StatusMessage[StatusMessage["BatterySafe"] = 247] = "BatterySafe";
  StatusMessage[StatusMessage["External Control"] = 252] = "External Control";
})(StatusMessage || (StatusMessage = {}));

var ErrorMessage;

(function (ErrorMessage) {
  ErrorMessage[ErrorMessage[""] = 0] = "";
  ErrorMessage[ErrorMessage["Battery voltage too high"] = 2] = "Battery voltage too high";
  ErrorMessage[ErrorMessage["Charger temperature too high"] = 17] = "Charger temperature too high";
  ErrorMessage[ErrorMessage["Charger over current"] = 18] = "Charger over current";
  ErrorMessage[ErrorMessage["Charger current reversed"] = 19] = "Charger current reversed";
  ErrorMessage[ErrorMessage["Bulk time limit exceeded"] = 20] = "Bulk time limit exceeded";
  ErrorMessage[ErrorMessage["Current sensor issue (sensor bias/sensor broken)"] = 21] = "Current sensor issue (sensor bias/sensor broken)";
  ErrorMessage[ErrorMessage["Terminals overheated"] = 26] = "Terminals overheated";
  ErrorMessage[ErrorMessage["Converter issue (dual converter models only)"] = 28] = "Converter issue (dual converter models only)";
  ErrorMessage[ErrorMessage["Input voltage too high (solar panel)"] = 33] = "Input voltage too high (solar panel)";
  ErrorMessage[ErrorMessage["Input current too high (solar panel)"] = 34] = "Input current too high (solar panel)";
  ErrorMessage[ErrorMessage["Input shutdown (due to excessive battery voltage)"] = 38] = "Input shutdown (due to excessive battery voltage)";
  ErrorMessage[ErrorMessage["Input shutdown (due to current flow during off mode)"] = 39] = "Input shutdown (due to current flow during off mode)";
  ErrorMessage[ErrorMessage["Lost communication with one of devices"] = 65] = "Lost communication with one of devices";
  ErrorMessage[ErrorMessage["Synchronised charging device configuration issue"] = 66] = "Synchronised charging device configuration issue";
  ErrorMessage[ErrorMessage["BMS connection lost"] = 67] = "BMS connection lost";
  ErrorMessage[ErrorMessage["Network misconfigured"] = 68] = "Network misconfigured";
  ErrorMessage[ErrorMessage["Factory calibration data lost"] = 116] = "Factory calibration data lost";
  ErrorMessage[ErrorMessage["Invalid/incompatible firmware"] = 117] = "Invalid/incompatible firmware";
  ErrorMessage[ErrorMessage["User settings invalid"] = 119] = "User settings invalid";
})(ErrorMessage || (ErrorMessage = {}));

var MPPTMessage;

(function (MPPTMessage) {
  MPPTMessage[MPPTMessage["Off"] = 0] = "Off";
  MPPTMessage[MPPTMessage["Voltage or current limited"] = 1] = "Voltage or current limited";
  MPPTMessage[MPPTMessage["MPP Tracker active"] = 2] = "MPP Tracker active";
})(MPPTMessage || (MPPTMessage = {}));

var AlarmReasonMessage;

(function (AlarmReasonMessage) {
  AlarmReasonMessage[AlarmReasonMessage[""] = 0] = "";
  AlarmReasonMessage[AlarmReasonMessage["Low Voltage"] = 1] = "Low Voltage";
  AlarmReasonMessage[AlarmReasonMessage["High Voltage"] = 2] = "High Voltage";
  AlarmReasonMessage[AlarmReasonMessage["Low SOC"] = 4] = "Low SOC";
  AlarmReasonMessage[AlarmReasonMessage["Low Starter Voltage"] = 8] = "Low Starter Voltage";
  AlarmReasonMessage[AlarmReasonMessage["High Starter Voltage"] = 16] = "High Starter Voltage";
  AlarmReasonMessage[AlarmReasonMessage["Low Temperature"] = 32] = "Low Temperature";
  AlarmReasonMessage[AlarmReasonMessage["High Temperature"] = 64] = "High Temperature";
  AlarmReasonMessage[AlarmReasonMessage["Mid Voltage"] = 128] = "Mid Voltage";
  AlarmReasonMessage[AlarmReasonMessage["Overload"] = 256] = "Overload";
  AlarmReasonMessage[AlarmReasonMessage["DC-ripple"] = 512] = "DC-ripple";
  AlarmReasonMessage[AlarmReasonMessage["Low V AC out"] = 1024] = "Low V AC out";
  AlarmReasonMessage[AlarmReasonMessage["High V AC out"] = 2048] = "High V AC out";
  AlarmReasonMessage[AlarmReasonMessage["Short Circuit"] = 4096] = "Short Circuit";
  AlarmReasonMessage[AlarmReasonMessage["BMS Lockout"] = 8192] = "BMS Lockout";
})(AlarmReasonMessage || (AlarmReasonMessage = {}));

var DeviceType;

(function (DeviceType) {
  DeviceType[DeviceType["MPPT"] = 0] = "MPPT";
  DeviceType[DeviceType["Inverter"] = 1] = "Inverter";
  DeviceType[DeviceType["BMV"] = 2] = "BMV";
  DeviceType[DeviceType["Charger"] = 3] = "Charger";
})(DeviceType || (DeviceType = {}));

var OffReasonMessage;

(function (OffReasonMessage) {
  OffReasonMessage[OffReasonMessage[""] = 0] = "";
  OffReasonMessage[OffReasonMessage["No input power"] = 1] = "No input power";
  OffReasonMessage[OffReasonMessage["Switched off (power switch)"] = 2] = "Switched off (power switch)";
  OffReasonMessage[OffReasonMessage["Switched off (device mode register) "] = 4] = "Switched off (device mode register) ";
  OffReasonMessage[OffReasonMessage["Remote input"] = 8] = "Remote input";
  OffReasonMessage[OffReasonMessage["Protection active"] = 10] = "Protection active";
  OffReasonMessage[OffReasonMessage["Paygo"] = 20] = "Paygo";
  OffReasonMessage[OffReasonMessage["BMS"] = 40] = "BMS";
  OffReasonMessage[OffReasonMessage["Engine shutdown detection"] = 80] = "Engine shutdown detection";
  OffReasonMessage[OffReasonMessage["Analysing input voltage"] = 100] = "Analysing input voltage";
})(OffReasonMessage || (OffReasonMessage = {}));

class UnsupportedDeviceData {
  constructor(VEDirectRawData, deviceId, deviceVEAdapterSN) {
    var _a; //VE.Direct -> UnsupportedDeviceData properties mapping


    const data = new VEDirectData(VEDirectRawData);
    this.deviceName = getDeviceName(data["PID"]);
    this.deviceId = deviceId;
    this.deviceSN = (_a = data["SER#"]) !== null && _a !== void 0 ? _a : null;
    this.deviceVEAdapterSN = deviceVEAdapterSN;
    this.deviceType = "Unsupported";
    this.VEDirectData = data;
  }

}
class BMVDeviceData {
  constructor(VEDirectRawData, deviceId, deviceVEAdapterSN) {
    var _a; //VE.Direct -> MPPTDeviceData properties mapping


    const data = new VEDirectData(VEDirectRawData);
    this.deviceName = getDeviceName(data["PID"]);
    this.deviceId = deviceId;
    this.deviceSN = (_a = data["SER#"]) !== null && _a !== void 0 ? _a : null;
    this.deviceVEAdapterSN = deviceVEAdapterSN;
    this.deviceType = DeviceType[2];
    this.deviceFirmwareVersion = getDeviceFW(data);
    this.batteryMidPointVoltage = getNullableNumber(data.VM) / 1000; //mV -> V

    this.batteryMidPointDeviation = getNullableNumber(data.DM) / 10;
    this.batteryAuxVoltage = getNullableNumber(data.VS) / 1000; //mV -> V

    this.batteryVoltage = getNullableNumber(data.V) / 1000; //mV -> V

    this.batteryCurrent = getNullableNumber(data.I) / 1000; //mA -> A

    this.batteryPercentage = getNullableNumber(data.SOC) / 10;
    this.batteryInstantaneousPower = getNullableNumber(data.P) / 1000;
    this.batteryTemperature = getNullableNumber(data.T); //Celsius

    this.consumedAmpHours = getNullableNumber(data.CE) / 1000;
    this.relayState = getStringBoolean(data.Relay);
    this.deepestDischargeAmpHours = getNullableNumber(data.H1) / 1000;
    this.lastDischargeAmpHours = getNullableNumber(data.H2) / 1000;
    this.averageDischargeAmpHours = getNullableNumber(data.H3) / 1000;
    this.chargeCycles = getNullableNumber(data.H4);
    this.fullDischarges = getNullableNumber(data.H5);
    this.cumulativeDrawnAmpHours = getNullableNumber(data.H6) / 1000;
    this.batteryMinVoltage = getNullableNumber(data.H7) / 1000;
    this.batteryMaxVoltage = getNullableNumber(data.H8) / 1000;
    this.hoursSinceLastFullCharge = getNullableNumber(data.H9) / 3600;
    this.automaticSynchronizations = getNullableNumber(data.H10);
    this.lowMainVoltageAlarms = getNullableNumber(data.H11);
    this.highMainVoltageAlarms = getNullableNumber(data.H12);
    this.lowAuxVoltageAlarms = getNullableNumber(data.H13);
    this.highAuxVoltageAlarms = getNullableNumber(data.H14);
    this.batteryAuxMinVoltage = getNullableNumber(data.H15) / 1000;
    this.batteryAuxMaxVoltage = getNullableNumber(data.H16) / 1000;
    this.dischargedEnergy = getNullableNumber(data.H17) / 100; //KWh

    this.chargedEnergy = getNullableNumber(data.H18) / 100; //KWh

    this.alarmState = getStringBoolean(data.Alarm);
    this.alarmMessage = AlarmReasonMessage[data.AR];
    this.VEDirectData = data;
  }

}
class MPPTDeviceData {
  constructor(VEDirectRawData, deviceId, deviceVEAdapterSN) {
    //VE.Direct -> MPPTDeviceData properties mapping
    const data = new VEDirectData(VEDirectRawData);
    this.deviceName = getDeviceName(data["PID"]);
    this.deviceId = deviceId;
    this.deviceSN = data["SER#"];
    this.deviceVEAdapterSN = deviceVEAdapterSN;
    this.deviceType = DeviceType[0];
    this.deviceFirmwareVersion = getDeviceFW(data);
    this.batteryVoltage = data["V"] / 1000; //mV -> V

    this.batteryCurrent = data["I"] / 1000; //mA -> A

    this.statusMessage = StatusMessage[data["CS"]];
    this.errorMessage = ErrorMessage[data["ERR"]];
    this.mpptMessage = MPPTMessage[data["MPPT"]];
    this.maximumPowerToday = data["H21"]; // W

    this.maximumPowerYesterday = data["H23"]; // W

    this.totalEnergyProduced = data["H19"] / 100; // kWh

    this.energyProducedToday = data["H20"] / 100; // kWh

    this.energyProducedYesterday = data["H22"] / 100; // kWh

    this.photovoltaicPower = data["PPV"]; // W

    this.photovoltaicVoltage = data["VPV"] / 1000; //mV -> V

    this.photovoltaicCurrent = this.photovoltaicPower / this.photovoltaicVoltage; //A

    this.loadCurrent = data["IL"] ? data["IL"] / 1000 : 0; //mA -> A

    this.loadOutputState = getStringBoolean(data["LOAD"]);
    this.relayState = getStringBoolean(data["Relay"]);
    this.offReasonMessage = OffReasonMessage[data["OR"]];
    this.daySequenceNumber = data["HSDS"];
    this.VEDirectData = data;
  }

}

function getDeviceName(pid) {
  if (deviceName[pid]) {
    return deviceName[pid];
  }

  return "Unknow Victron Device";
}

function getDeviceFW(VEDirectData) {
  const fw = VEDirectData["FW"] || VEDirectData["FWE"];
  return typeof fw === "number" ? fw / 100 : -1;
}

function getStringBoolean(stringBoolean) {
  return stringBoolean === "ON" || stringBoolean === "On";
}

function getNullableNumber(nullableNumber) {
  return nullableNumber !== null && nullableNumber !== void 0 ? nullableNumber : 0;
}

var _VEDirectPnP_instances, _VEDirectPnP_version, _VEDirectPnP_parameters, _VEDirectPnP_listenersStack, _VEDirectPnP_VEDirectDevicesData, _VEDirectPnP_VEDirectDevicesDataMapped, _VEDirectPnP_serialPorts, _VEDirectPnP_flags, _VEDirectPnP_deviceRelations, _VEDirectPnP_emitEvent, _VEDirectPnP_getVictronDeviceSN, _VEDirectPnP_getDeviceVEAdapterSN, _VEDirectPnP_mapVictronDeviceData, _VEDirectPnP_clean, _VEDirectPnP_closeSerialPorts, _VEDirectPnP_updateVEDirectDataDeviceData, _VEDirectPnP_setDeviceRelations, _VEDirectPnP_getVEDirectDevicesAvailable, _VEDirectPnP_initVEDirectDataStreamFromAllDevices, _VEDirectPnP_initDataStreamFromVEDirect;
class VEDirectPnP {
  constructor({
    VEDirectDevicesPath = "/dev/serial/by-id/",
    customVEDirectDevicesPaths = []
  } = {}, deviceRelations) {
    _VEDirectPnP_instances.add(this);

    _VEDirectPnP_version.set(this, void 0);

    _VEDirectPnP_parameters.set(this, void 0);

    _VEDirectPnP_listenersStack.set(this, void 0);

    _VEDirectPnP_VEDirectDevicesData.set(this, void 0);

    _VEDirectPnP_VEDirectDevicesDataMapped.set(this, void 0);

    _VEDirectPnP_serialPorts.set(this, void 0);

    _VEDirectPnP_flags.set(this, void 0);

    _VEDirectPnP_deviceRelations.set(this, void 0);

    __classPrivateFieldSet(this, _VEDirectPnP_version, 0.20, "f");

    __classPrivateFieldSet(this, _VEDirectPnP_parameters, {
      VEDirectDevicesPath,
      customVEDirectDevicesPaths
    }, "f");

    __classPrivateFieldSet(this, _VEDirectPnP_listenersStack, [], "f");

    __classPrivateFieldSet(this, _VEDirectPnP_VEDirectDevicesData, {}, "f");

    __classPrivateFieldSet(this, _VEDirectPnP_VEDirectDevicesDataMapped, {}, "f");

    __classPrivateFieldSet(this, _VEDirectPnP_serialPorts, [], "f");

    __classPrivateFieldSet(this, _VEDirectPnP_flags, {
      requestedInit: false,
      initialized: false,
      deviceRelationsSet: false
    }, "f");

    __classPrivateFieldSet(this, _VEDirectPnP_deviceRelations, deviceRelations !== null && deviceRelations !== void 0 ? deviceRelations : {}, "f");

    this.init();
  }

  init() {
    if (!__classPrivateFieldGet(this, _VEDirectPnP_flags, "f").requestedInit && !__classPrivateFieldGet(this, _VEDirectPnP_flags, "f").initialized) {
      __classPrivateFieldSet(this, _VEDirectPnP_flags, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _VEDirectPnP_flags, "f")), {
        requestedInit: true
      }), "f");

      __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_initVEDirectDataStreamFromAllDevices).call(this).then(() => {
        __classPrivateFieldSet(this, _VEDirectPnP_flags, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _VEDirectPnP_flags, "f")), {
          initialized: true
        }), "f");

        __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "stream-init", {
          message: "VE.Direct devices data stream init"
        });
      }).catch(() => {
        __classPrivateFieldSet(this, _VEDirectPnP_flags, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _VEDirectPnP_flags, "f")), {
          requestedInit: false,
          initialized: false
        }), "f");

        __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "error", {
          message: "Failed to get data from VE.Direct devices"
        });
      });
    }
  }

  on(event, callback) {
    const listener = (eventEmmited, eventData) => {
      if (event === eventEmmited || event === "all") {
        callback(eventData);
      }
    };

    __classPrivateFieldGet(this, _VEDirectPnP_listenersStack, "f").push(listener);
  }

  getVersion() {
    return __classPrivateFieldGet(this, _VEDirectPnP_version, "f");
  }

  destroy(callback) {
    if (__classPrivateFieldGet(this, _VEDirectPnP_serialPorts, "f").length > 0) {
      __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_closeSerialPorts).call(this).then(() => {
        __classPrivateFieldSet(this, _VEDirectPnP_flags, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _VEDirectPnP_flags, "f")), {
          requestedInit: false,
          initialized: false
        }), "f");

        __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "stream-destroy", {
          message: "VE.Direct devices data stream has been destroyed"
        });

        if (callback) callback();
      }).catch(() => {
        __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "error", {
          message: "Something went wrong trying to destroy VE.Direct devices data stream"
        });
      });
    }
  }

  getDevicesData() {
    return __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f");
  }

  getBatteriesData() {
    return this.getDevicesDataByType("BMV");
  }

  getBatteryData(deviceId) {
    var _a, _b;

    if (deviceId && ((_a = __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f")[deviceId]) === null || _a === void 0 ? void 0 : _a.deviceType) === "BMV") {
      return __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f")[deviceId];
    }

    const mainBatteryDeviceId = (_b = __classPrivateFieldGet(this, _VEDirectPnP_deviceRelations, "f")) === null || _b === void 0 ? void 0 : _b.mainBatteryDeviceId;

    if (mainBatteryDeviceId) {
      return __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f")[mainBatteryDeviceId];
    }

    return null;
  }

  getMPPTData(deviceId) {
    var _a, _b;

    if (deviceId && ((_a = __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f")[deviceId]) === null || _a === void 0 ? void 0 : _a.deviceType) === "MPPT") {
      return __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f")[deviceId];
    }

    const mainMPPTDeviceId = (_b = __classPrivateFieldGet(this, _VEDirectPnP_deviceRelations, "f")) === null || _b === void 0 ? void 0 : _b.mainMPPTDeviceId;

    if (mainMPPTDeviceId) {
      return __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f")[mainMPPTDeviceId];
    }

    return null;
  }

  getInvertersData() {
    return this.getDevicesDataByType("Inverter");
  }

  getChargersData() {
    return this.getDevicesDataByType("Charger");
  }

  getMPPTsData() {
    return this.getDevicesDataByType("MPPT");
  }

  getDevicesDataByType(deviceType) {
    return Object.values(__classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f")).filter(device => device.deviceType === deviceType);
  }

  reset() {
    this.destroy(() => {
      __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_clean).call(this);

      this.init();
    });
  }

}
_VEDirectPnP_version = new WeakMap(), _VEDirectPnP_parameters = new WeakMap(), _VEDirectPnP_listenersStack = new WeakMap(), _VEDirectPnP_VEDirectDevicesData = new WeakMap(), _VEDirectPnP_VEDirectDevicesDataMapped = new WeakMap(), _VEDirectPnP_serialPorts = new WeakMap(), _VEDirectPnP_flags = new WeakMap(), _VEDirectPnP_deviceRelations = new WeakMap(), _VEDirectPnP_instances = new WeakSet(), _VEDirectPnP_emitEvent = function _VEDirectPnP_emitEvent(event, eventData) {
  for (const listener of __classPrivateFieldGet(this, _VEDirectPnP_listenersStack, "f")) {
    listener(event, Object.assign(Object.assign({}, eventData), {
      eventName: event
    }));
  }
}, _VEDirectPnP_getVictronDeviceSN = function _VEDirectPnP_getVictronDeviceSN(VEDirectData) {
  var _a;

  return (_a = VEDirectData["SER#"]) !== null && _a !== void 0 ? _a : null;
}, _VEDirectPnP_getDeviceVEAdapterSN = function _VEDirectPnP_getDeviceVEAdapterSN(VEDirectDevicePath) {
  var _a;

  return (_a = VEDirectDevicePath === null || VEDirectDevicePath === void 0 ? void 0 : VEDirectDevicePath.match(/Direct_cable_([^-]+)/)[1]) !== null && _a !== void 0 ? _a : null;
}, _VEDirectPnP_mapVictronDeviceData = function _VEDirectPnP_mapVictronDeviceData(deviceData, deviceId, deviceVEAdapterSN) {
  if (!isNaN(deviceData["MPPT"])) {
    return new MPPTDeviceData(deviceData, deviceId, deviceVEAdapterSN);
  } else if (!isNaN(deviceData["SOC"])) {
    return new BMVDeviceData(deviceData, deviceId, deviceVEAdapterSN);
  } else {
    return new UnsupportedDeviceData(deviceData, deviceId, deviceVEAdapterSN);
  }
}, _VEDirectPnP_clean = function _VEDirectPnP_clean() {
  __classPrivateFieldSet(this, _VEDirectPnP_VEDirectDevicesData, {}, "f");
}, _VEDirectPnP_closeSerialPorts = function _VEDirectPnP_closeSerialPorts() {
  return new Promise((resolve, reject) => {
    if (__classPrivateFieldGet(this, _VEDirectPnP_serialPorts, "f").length > 0) {
      const serialPortClosePromises = __classPrivateFieldGet(this, _VEDirectPnP_serialPorts, "f").map(serialPort => {
        return new Promise((resolve, reject) => {
          serialPort.close(error => {
            if (error) {
              console.error(error);
              reject();
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(serialPortClosePromises).then(() => {
        __classPrivateFieldSet(this, _VEDirectPnP_serialPorts, [], "f");

        resolve();
      }).catch(() => reject);
    } else {
      reject();
    }
  });
}, _VEDirectPnP_updateVEDirectDataDeviceData = function _VEDirectPnP_updateVEDirectDataDeviceData(VEDirectData, deviceId, vedirectSerialNumber) {
  var _a;

  const previousVEDirectRawData = (_a = __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesData, "f")[deviceId]) !== null && _a !== void 0 ? _a : {};
  const deviceNewData = Object.assign(Object.assign({}, previousVEDirectRawData), Object.assign(Object.assign({}, VEDirectData), {
    dataTimeStamp: new Date().getTime()
  }));

  __classPrivateFieldSet(this, _VEDirectPnP_VEDirectDevicesData, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesData, "f")), {
    [deviceId]: deviceNewData
  }), "f");

  const deviceNewDataMapped = __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_mapVictronDeviceData).call(this, deviceNewData, deviceId, vedirectSerialNumber);

  __classPrivateFieldSet(this, _VEDirectPnP_VEDirectDevicesDataMapped, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesDataMapped, "f")), {
    [deviceId]: deviceNewDataMapped
  }), "f");

  if (!__classPrivateFieldGet(this, _VEDirectPnP_flags, "f").deviceRelationsSet) {
    __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_setDeviceRelations).call(this);
  }
}, _VEDirectPnP_setDeviceRelations = function _VEDirectPnP_setDeviceRelations() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;

  const newDeviceRelations = Object.assign({}, __classPrivateFieldGet(this, _VEDirectPnP_deviceRelations, "f"));

  if (!((_a = __classPrivateFieldGet(this, _VEDirectPnP_deviceRelations, "f")) === null || _a === void 0 ? void 0 : _a.mainBatteryDeviceId)) {
    const batteryDeviceId = (_c = (_b = this.getBatteriesData()[0]) === null || _b === void 0 ? void 0 : _b.deviceId) !== null && _c !== void 0 ? _c : null;
    newDeviceRelations.mainBatteryDeviceId = batteryDeviceId;
  }

  if (!((_d = __classPrivateFieldGet(this, _VEDirectPnP_deviceRelations, "f")) === null || _d === void 0 ? void 0 : _d.mainMPPTDeviceId)) {
    const mmptDeviceId = (_f = (_e = this.getMPPTsData()[0]) === null || _e === void 0 ? void 0 : _e.deviceId) !== null && _f !== void 0 ? _f : null;
    newDeviceRelations.mainMPPTDeviceId = mmptDeviceId;
  }

  if (!((_g = __classPrivateFieldGet(this, _VEDirectPnP_deviceRelations, "f")) === null || _g === void 0 ? void 0 : _g.mainInverterDeviceId)) {
    const inverterDeviceId = (_j = (_h = this.getInvertersData()[0]) === null || _h === void 0 ? void 0 : _h.deviceId) !== null && _j !== void 0 ? _j : null;
    newDeviceRelations.mainInverterDeviceId = inverterDeviceId;
  }

  if (!((_k = __classPrivateFieldGet(this, _VEDirectPnP_deviceRelations, "f")) === null || _k === void 0 ? void 0 : _k.mainChargerDeviceId)) {
    const chargerDeviceId = (_m = (_l = this.getChargersData()[0]) === null || _l === void 0 ? void 0 : _l.deviceId) !== null && _m !== void 0 ? _m : null;
    newDeviceRelations.mainChargerDeviceId = chargerDeviceId;
  }

  __classPrivateFieldSet(this, _VEDirectPnP_flags, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _VEDirectPnP_flags, "f")), {
    deviceRelationsSet: true
  }), "f");
}, _VEDirectPnP_getVEDirectDevicesAvailable = function _VEDirectPnP_getVEDirectDevicesAvailable() {
  return new Promise((resolve, reject) => {
    child_process.exec(`ls ${__classPrivateFieldGet(this, _VEDirectPnP_parameters, "f").VEDirectDevicesPath}`, (error, stdout, stderr) => {
      const errorData = error || stderr;

      if (errorData) {
        __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "error", {
          message: "Failed to get available VE.Direct devices, try with customVEDirectDevicesPaths option.",
          dataDump: errorData
        });

        reject([]);
        return;
      }

      const rawConsoleResponse = stdout.split('\n');
      const validVEDirectInterfaces = rawConsoleResponse.filter(deviceId => deviceId.indexOf("VE_Direct") !== -1);
      const absoluteDevicesPath = validVEDirectInterfaces.map(device => {
        const absoluteDevicePath = __classPrivateFieldGet(this, _VEDirectPnP_parameters, "f").VEDirectDevicesPath + device;

        __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "interface-found", {
          message: "Found VE.Direct serial port interface",
          dataDump: absoluteDevicePath
        });

        return absoluteDevicePath;
      });
      resolve(absoluteDevicesPath);
    });
  });
}, _VEDirectPnP_initVEDirectDataStreamFromAllDevices = function _VEDirectPnP_initVEDirectDataStreamFromAllDevices() {
  return new Promise((resolve, reject) => {
    if (__classPrivateFieldGet(this, _VEDirectPnP_parameters, "f").customVEDirectDevicesPaths && __classPrivateFieldGet(this, _VEDirectPnP_parameters, "f").customVEDirectDevicesPaths.length > 0) {
      const devicesPromises = __classPrivateFieldGet(this, _VEDirectPnP_parameters, "f").customVEDirectDevicesPaths.map((devicePath, deviceIndex) => __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_initDataStreamFromVEDirect).call(this, devicePath, deviceIndex));

      Promise.all(devicesPromises).then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_getVEDirectDevicesAvailable).call(this).then(devicesPathsFound => {
        const devicesPromises = devicesPathsFound.map((devicePath, deviceIndex) => __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_initDataStreamFromVEDirect).call(this, devicePath, deviceIndex));
        Promise.all(devicesPromises).then(() => {
          resolve();
        });
      }).catch(() => {
        reject();
      });
    }
  });
}, _VEDirectPnP_initDataStreamFromVEDirect = function _VEDirectPnP_initDataStreamFromVEDirect(devicePath, deviceIndex) {
  return new Promise((resolve, reject) => {
    const port = new SerialPort__default["default"](devicePath, {
      baudRate: 19200,
      dataBits: 8,
      parity: 'none'
    }, err => {
      if (err) {
        __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "error", {
          message: `Device ${devicePath} serial port error`,
          dataDump: err
        });

        __classPrivateFieldSet(this, _VEDirectPnP_VEDirectDevicesData, {}, "f");

        reject();
      }
    });
    port.on("open", () => {
      __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "device-connection-open", {
        message: "VE.Direct device connected through serial port",
        dataDump: devicePath
      });
    });
    port.on('error', err => {
      __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "device-connection-error", {
        message: "VE.Direct device connection error through serial port",
        dataDump: {
          devicePath: devicePath,
          errorDataDump: err
        }
      });
    });

    __classPrivateFieldGet(this, _VEDirectPnP_serialPorts, "f").push(port);

    const delimiter = new SerialPort__default["default"].parsers.Delimiter({
      delimiter: Buffer.from([0x0d, 0x0a], 'hex'),
      includeDelimiter: false
    });
    const VEDParser = new VEDirectParser();
    port.pipe(delimiter).pipe(VEDParser);
    VEDParser.on("data", VEDirectRawData => {
      const deviceSerialNumber = __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_getVictronDeviceSN).call(this, VEDirectRawData);

      const vedirectSerialNumber = __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_getDeviceVEAdapterSN).call(this, devicePath);

      const deviceId = deviceSerialNumber ? deviceSerialNumber : vedirectSerialNumber;

      if (!deviceId) {
        __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_emitEvent).call(this, "error", {
          message: "Cannot assign a device id",
          dataDump: VEDirectData
        });

        return;
      }

      if (!__classPrivateFieldGet(this, _VEDirectPnP_VEDirectDevicesData, "f")[deviceId]) {
        resolve();
      }

      __classPrivateFieldGet(this, _VEDirectPnP_instances, "m", _VEDirectPnP_updateVEDirectDataDeviceData).call(this, VEDirectRawData, deviceId, vedirectSerialNumber);
    });
  });
};

module.exports = VEDirectPnP;
