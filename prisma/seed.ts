import {
  type Prisma,
  PrismaClient,
  VersionStatus,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

// versionStatus is filled in by main() unless given: KNOWN with a version, UNKNOWN without.
const assets: Prisma.AssetCreateManyInput[] = [
  {
    ip: "10.10.1.11",
    deviceType: "Patient Monitor",
    manufacturer: "Philips",
    product: "IntelliVue MX450",
    version: "M.00.03",
  },
  {
    ip: "10.10.1.12",
    deviceType: "Patient Monitor",
    manufacturer: "Philips",
    product: "IntelliVue MX450",
    version: "M.00.03",
  },
  {
    ip: "10.10.1.13",
    deviceType: "Patient Monitor",
    manufacturer: "Philips",
    product: "IntelliVue MX800",
    version: "L.01.18",
  },
  {
    ip: "10.10.1.21",
    deviceType: "Patient Monitor",
    manufacturer: "GE Healthcare",
    product: "CARESCAPE B650",
    version: "3.2",
  },
  {
    ip: "10.10.1.22",
    deviceType: "Patient Monitor",
    manufacturer: "GE Healthcare",
    product: "CARESCAPE B650",
    version: null,
  },
  {
    ip: "10.10.1.31",
    deviceType: "Patient Monitor",
    manufacturer: "Contec Health",
    product: "CMS8000 Patient Monitor",
    version: "CMS7.820.120.01/0.93(0.95)",
  },
  {
    ip: "10.10.1.31",
    deviceType: "Patient Monitor",
    manufacturer: "Contec Health",
    product: "CMS8000 Patient Monitor",
    version: null,
  },
  {
    ip: "10.10.1.41",
    deviceType: "Patient Monitor",
    manufacturer: "Medtronic",
    product: "MyCareLink Patient Monitor",
    version: null,
  },
  {
    ip: "10.10.2.31",
    deviceType: "Infusion Pump",
    manufacturer: "BD",
    product: "Alaris 8015 PC Unit",
    version: "12.1.2",
  },
  {
    ip: "10.10.2.32",
    deviceType: "Infusion Pump",
    manufacturer: "BD",
    product: "Alaris 8015 PC Unit",
    version: "12.1.2",
  },
  {
    ip: "10.10.2.33",
    deviceType: "Infusion Pump",
    manufacturer: "BD",
    product: "Alaris 8015 PC Unit",
    version: "9.33",
  },
  {
    ip: "10.10.2.41",
    deviceType: "Infusion Pump",
    manufacturer: "Baxter",
    product: "Sigma Spectrum",
    version: "8.00.01",
  },
  {
    ip: "10.10.3.51",
    deviceType: "Ventilator",
    manufacturer: "Medtronic",
    product: "Puritan Bennett 980",
    version: "4.1.0",
  },
  {
    ip: "10.10.3.52",
    deviceType: "Ventilator",
    manufacturer: "Dräger",
    product: "Evita V500",
    version: "2.51",
  },
  {
    ip: "10.10.3.53",
    deviceType: "Ventilator",
    manufacturer: "Hamilton Medical",
    product: "HAMILTON-C6",
    version: "1.1.4",
  },
  {
    ip: "10.10.3.54",
    deviceType: "Ventilator",
    manufacturer: "Baxter",
    product: "Life2000 Ventilator",
    version: "06.08.00.00",
  },
  {
    ip: "10.10.3.55",
    deviceType: "Ventilator",
    manufacturer: "Baxter",
    product: "Life2000 Ventilator",
    version: "06.07.00.00",
  },
  {
    ip: "10.10.3.56",
    deviceType: "Ventilator",
    manufacturer: "Baxter",
    product: "Life2000 Ventilator",
    version: null,
  },
  {
    ip: "10.10.4.61",
    deviceType: "CT Scanner",
    manufacturer: "Siemens Healthineers",
    product: "SOMATOM go.Up",
    version: "VA30",
  },
  {
    ip: "10.10.4.62",
    deviceType: "MRI Scanner",
    manufacturer: "GE Healthcare",
    product: "SIGNA Premier",
    version: "MR30.1",
  },
  {
    ip: "10.10.4.63",
    deviceType: "X-Ray System",
    manufacturer: "Carestream",
    product: "DRX-Revolution",
    version: "5.7",
  },
  {
    ip: "10.10.4.64",
    deviceType: "Ultrasound",
    manufacturer: "Canon Medical",
    product: "Aplio i800",
    version: null,
  },
  {
    ip: "10.10.4.65",
    deviceType: "CT Scanner",
    manufacturer: "Siemens Healthineers",
    product: "NAEOTOM Alpha",
    version: "VA40 SP2",
  },
  {
    ip: "10.10.5.71",
    deviceType: "Lab Analyzer",
    manufacturer: "Roche",
    product: "cobas 6000",
    version: "06-02",
  },
  {
    ip: "10.10.5.72",
    deviceType: "Lab Analyzer",
    manufacturer: "Abbott",
    product: "ARCHITECT i2000SR",
    version: "9.5",
  },
  {
    ip: "10.10.5.73",
    deviceType: "Blood Gas Analyzer",
    manufacturer: "Radiometer",
    product: "ABL90 FLEX PLUS",
    version: "3.4",
  },
  {
    ip: "10.10.6.81",
    deviceType: "Medication Dispensing Cabinet",
    manufacturer: "Omnicell",
    product: "XT Automated Dispensing Cabinet",
    version: "22.1",
  },
  {
    ip: "10.10.6.82",
    deviceType: "Medication Dispensing Cabinet",
    manufacturer: "BD",
    product: "Pyxis MedStation ES",
    version: "1.7.1",
  },
  {
    ip: "10.10.7.92",
    deviceType: null,
    manufacturer: "Zebra",
    product: "ZD621 Printer",
    version: null,
    versionStatus: VersionStatus.NOT_APPLICABLE,
  },
];

async function main() {
  // Load the demo data once: a database that already has assets is left alone.
  const existing = await prisma.asset.count();
  if (existing > 0) {
    console.log(`Skipping seed: ${existing} assets already exist.`);
    return;
  }

  await prisma.asset.createMany({
    data: assets.map((asset) => ({
      ...asset,
      versionStatus:
        asset.versionStatus ??
        (asset.version ? VersionStatus.KNOWN : VersionStatus.UNKNOWN),
    })),
  });
  console.log(`Seeded ${assets.length} assets.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
