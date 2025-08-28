// Row Data Interface

// Grid API: Access to Grid API methods
let gridApi;

// Grid Options: Contains all of the grid configurations
const gridOptions = {
  pagination: true,
  rowSelection: {
        mode: 'multiRow',
        copySelectedRows: true
    },
  // Data to be displayed
  rowData: [], 
  // Columns to be displayed (Should match rowData properties)
  columnDefs: [
    { field: "doi",
    cellRenderer: params => {
      if (!params.value) return '';
      const url = 'https://doi.org/' + params.value;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${params.value}</a>`;
    } },
    { field: "clientId", filter: true, floatingFilter: true  },
    { field: "publicationYear", filter: true, floatingFilter: true  },
    { field: "resourceType", filter: true, floatingFilter: true  },
    { field: "title", filter: true, floatingFilter: true  },
    { field: "publisher", filter: true, floatingFilter: true  },
    { field: "isPublisher", filter: true, floatingFilter: true  },
    { field: "isLatestVersion", filter: true, floatingFilter: true  },
    { field: "isConceptDoi", filter: true, floatingFilter: true  }
  ],
  defaultColDef: {
    flex: 1,
  }
};
// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
gridApi = agGrid.createGrid(document.querySelector("#myGrid"), gridOptions);

// Read an uploaded CSV file and convert it to a JSON string here.
function csvFileToJsonArray(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const csv = event.target.result;
            const lines = csv.split('\n').filter(line => line.trim() !== '');
            const headers = lines[0].split(',').map(h => h.trim());
            const data = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header] = values[i];
                });
                return obj;
            });
            resolve(data);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('csvInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            csvFileToJsonArray(file).then(jsonArray => {
                gridApi.setGridOption('rowData', jsonArray);
            });
        }
    });
});
