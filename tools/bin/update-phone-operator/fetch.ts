import * as fs from 'fs';
import * as path from 'path';
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;

const WIKI_URL = 'https://en.wikipedia.org/wiki/Mobile_country_code';
const WIKI_URL_REGIONS: string[] = [
  'https://en.wikipedia.org/wiki/Mobile_Network_Codes_in_ITU_region_2xx_(Europe)',
  'https://en.wikipedia.org/wiki/Mobile_Network_Codes_in_ITU_region_3xx_(North_America)',
  'https://en.wikipedia.org/wiki/Mobile_Network_Codes_in_ITU_region_4xx_(Asia)',
  'https://en.wikipedia.org/wiki/Mobile_Network_Codes_in_ITU_region_5xx_(Oceania)',
  'https://en.wikipedia.org/wiki/Mobile_Network_Codes_in_ITU_region_6xx_(Africa)',
  'https://en.wikipedia.org/wiki/Mobile_Network_Codes_in_ITU_region_7xx_(South_America)',
];

const MCC_MNC_OUTPUT_FILE: string = path.join(__dirname, 'mcc-mnc-list.json');
const STATUS_CODES_OUTPUT_FILE: string = path.join(
  __dirname,
  'status-codes.json',
);

interface Record {
  type: string;
  countryName: string;
  countryCode: string;
  mcc: string | null;
  mnc: string | null;
  brand: string | null;
  operator: string | null;
  status: string | null;
  bands: string | null;
  notes: string | null;
}

export async function fetch() {
  let records: Record[] = [];
  let statusCodes: string[] = [];

  const process = (
    region: string,
    records: Record[],
    statusCodes: string[],
  ): Promise<void> =>
    new Promise((resolve) => collect(resolve, region, records, statusCodes));

  await (async function loop() {
    for (let i = 0; i < WIKI_URL_REGIONS.length; i++) {
      const region = WIKI_URL_REGIONS[i];
      await process(region, records, statusCodes);
      console.log(region, records.length, statusCodes.length);
    }

    await process(WIKI_URL, records, statusCodes);
    console.log(WIKI_URL, records.length, statusCodes.length);

    // writeData(records, statusCodes);
  })();

  return {
    records,
    statusCodes,
  };
}

function collect(
  resolve: () => void,
  from: string,
  records: Record[],
  statusCodes: string[],
): void {
  JSDOM.fromURL(from).then((dom) => {
    const { window } = dom;
    var content = window.document.querySelector(
      '#mw-content-text > .mw-parser-output',
    );

    if (!content.hasChildNodes()) {
      console.log('ERROR - empty content');
      return;
    }

    content = removeCiteReferences(content);

    const children = content.childNodes;
    let recordType: string = 'other',
      sectionName: string,
      countryName: string | null = null,
      countryCode: string | null = null;

    nodeList: for (let i = 0; i < children.length; i++) {
      let node = children[i];

      if (!node.textContent.trim().length) {
        // skip empty lines
        continue;
      }

      if (node.nodeName === 'H2') {
        recordType = 'other';
        sectionName = node.querySelector('.mw-headline').textContent.trim();

        if (
          sectionName === 'See also' ||
          sectionName === 'External links' ||
          sectionName === 'National MNC Authorities'
        ) {
          continue;
        }

        if (sectionName === 'National operators') {
          recordType = 'National';
        }

        if (sectionName.length === 1) {
          continue;
        }

        if (sectionName === 'Test networks') {
          recordType = 'Test';
        }

        if (sectionName === 'International operators') {
          recordType = 'International';
        }

        if (recordType === 'other') {
          //  console.log('WARN recordType is other', node.textContent);
        }
      }

      if (node.nodeName === 'H4') {
        let countryText = node.querySelector('.mw-headline').textContent.trim();
        let dashPos = countryText.indexOf('-');
        countryName = countryText.substr(0, dashPos - 1);
        countryCode = countryText.substr(dashPos + 2);
      }

      if (node.nodeName === 'TABLE') {
        if (recordType === 'National') {
          continue;
        }

        let rows = node.querySelectorAll('tr');

        for (let j = 1; j < rows.length; j++) {
          let cols = rows[j].querySelectorAll('td');

          if (cols.length < 7) {
            //    console.log('WARN invalid table row:', rows[j], node.textContent);
            continue;
          }

          const mccChild = cols[0].querySelector('div');
          if (mccChild !== null) {
            cols[0].removeChild(mccChild);
          }

          let status = cleanup(cols[4].textContent);
          if (status === 'Not Operational' || status === 'Not opearational') {
            status = 'Not operational';
          }
          if (status === 'operational') {
            status = 'Operational';
          }

          if (status && statusCodes.indexOf(status) === -1) {
            statusCodes.push(status);
          }

          records.push({
            type: recordType,
            countryName: countryName as string,
            countryCode: countryCode as string,
            mcc: cleanup(cols[0].textContent),
            mnc: cleanup(cols[1].textContent),
            brand: cleanup(cols[2].textContent),
            operator: cleanup(cols[3].textContent),
            status: status,
            bands: cleanup(cols[5].textContent),
            notes: cleanup(cols[6].textContent),
          });
        }
      }
    }

    resolve();
  });
}

function writeData(records: Record[], statusCodes: string[]): void {
  fs.writeFile(MCC_MNC_OUTPUT_FILE, JSON.stringify(records, null, 2), (err) => {
    if (err) {
      throw err;
    }
    console.log('MCC-MNC list saved to ' + MCC_MNC_OUTPUT_FILE);
    console.log('Total ' + records.length + ' records');
  });

  statusCodes.sort();

  fs.writeFile(
    STATUS_CODES_OUTPUT_FILE,
    JSON.stringify(statusCodes, null, 2),
    (err) => {
      if (err) {
        throw err;
      }
      console.log('Status codes saved to ' + STATUS_CODES_OUTPUT_FILE);
    },
  );
}

function removeCiteReferences(nodes: any): any {
  let links = nodes.querySelectorAll('a');
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    let href = link.getAttribute('href');
    if (href && href.substr(0, 10) === '#cite_note') {
      link.remove();
    }
  }

  return nodes;
}

function cleanup(str: string): string | null {
  str = str.trim();
  str = removeCitationNeeded(str);
  if (str.substring(0, 1) === '[' && str.substring(-1) === ']') {
    // remove brackets-only like [7]
    str = '';
  }
  if (str.substring(0, 1) !== '[' && str.substring(-1) === ']') {
    // remove postfix references like ...[7]
    let index = str.lastIndexOf('[');
    str = str.substring(0, index - 1).trim();
  }
  str = str.replace(/“/g, '"');
  return str.length ? str : null;
}

function removeCitationNeeded(str: string): string {
  return str.replace(/\[citation needed\]/g, '');
}

// fetch();
