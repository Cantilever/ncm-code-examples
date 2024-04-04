export async function handler(event) {
  const URL = "<https://nationalchildrenmuseum.my.salesforce-sites.com/ticket/PatronTicket__PublicApiEventList>";
  const { getBirthdays } = JSON.parse(event.body);

  console.log('getBirthdays:', getBirthdays);

  const reshapeData = (data) => {
    return data.map(event => {
      return {
        name: event.name,
        type: event.type,
        instances: event.instances ? event.instances.map(instance => {
          return {
            eventName: instance.eventName,
            date: instance.formattedDates.ISO8601,
            soldOut: instance.soldOut,
            purchaseUrl: instance.purchaseUrl,
          };
        }) : [],
        purchaseUrl: event.purchaseUrl,
      };
    })
  };

  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle the error
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: "Error fetching data" }),
      };
    }

    const data = await response.json();

    if (getBirthdays) {
      // Filter out the events that are not birthdays
      const birthdays = data.events.filter(event => event.name.includes("Birthday Reservation"));

      return {
        statusCode: 200,
        body: JSON.stringify(reshapeData(birthdays)),
      };
    } else {
      const events = data.events.filter(event => !event.name.includes("Birthday Reservation"));

      return {
        statusCode: 200,
        body: JSON.stringify(reshapeData(events)),
      };
    }
  }

   catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}
