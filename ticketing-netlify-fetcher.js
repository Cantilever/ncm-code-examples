axios.post('./.netlify/functions/getTickets', { getBirthdays: false })
      .then(response => {
        const events = response.data;
        console.log('events:', events);
      })
      .catch(error => {
        console.log(error)
      })
