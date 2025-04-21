const fetchBusData = async () => {
  try {
    const response = await fetch("/next-departure");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching bus date: ${error}`);
  }
};

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
}; // функция для преобразования и разделения даты по часовому поясу

const formatTime = (date) => {
  return date.toTimeString().split(" ")[0].slice(0, 5);
}; // функция для преобразования и разделения времени по часовому поясу

const renderBusData = (buses) => {
  const tableBody = document.querySelector('#bus tbody');
  tableBody.textContent = '';

  buses.forEach(bus => {
    const row = document.createElement('tr');
    const nextDepartureDateTimeUTC = new Date(`${bus.nextDeparture.date}T${bus.nextDeparture.time}Z`);

    row.innerHTML = `
    <td>${bus.busNumber}</td>
    <td>${bus.startPoint} - ${bus.endPoint}</td>
    <td>${formatDate(nextDepartureDateTimeUTC)}</td>
    <td>${formatTime(nextDepartureDateTimeUTC)}</td>
    <td>${bus.nextDeparture.remaining}</td>
    `

    tableBody.append(row);
  })
};

const initWebSocket = () => {
  const ws = new WebSocket(`ws://${location.host}`);

  ws.addEventListener('open', () => {
    console.log('websocket connection');
  });

  ws.addEventListener('message', (event) => {
    const buses = JSON.parse(event.data);
    renderBusData(buses);
  });

  ws.addEventListener('error', (error) => {
    console.log(`websocket connection: ${error}`);
  });

  ws.addEventListener('close', (error) => {
    console.log(`websocket connection close`);
  });
};

const init = async () => {
  const buses = await fetchBusData();
  renderBusData(buses);

  initWebSocket();
};

init();
