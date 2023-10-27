async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇

  const footer = document.querySelector('footer')
  const currentYear = new Date().getFullYear()
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`

  const learnersContainer = document.querySelector('.cards');
  const errorMessage = 'Something is wrong';

  async function fetchData() {
    try {
      const [ learnersResponse, mentorsResponse] = await Promise.all([
        axios.get('http://localhost:3003/api/learners'),
        axios.get('http://localhost:3003/api/mentors')
      ]);

      // process the data
      const learners = learnersResponse.data;
      const mentors = mentorsResponse.data;

      const mentorsMap = new Map();
      mentors.forEach(mentor => {
        mentorsMap.set(mentor.id, mentor);
      });

      // array to store the combines learner data
      const combinedData = learners.map(learner => {
        const learnerInfo = {
            id: learner.id,
            name: learner.fullName,
            email: learner.email,
            mentors: learner.mentors.map(mentorId => {
                const mentor = mentors.find(m => m.id === mentorId);
                return mentor ? `${mentor.firstName} ${mentor.lastName}` : 'Unknown Mentor';
            })
        };
        return learnerInfo;
      });

      learnersContainer.textContent = '';

      combinedData.forEach(learner => {
        const learnerCard = createLearnerCard(learner);
      })


    } catch (error) {
      footer.textContent = errorMessage;
    }
  }

  function createLearnerCard(learner) {
    const card = document.createElement('div');
    card.classList.add('card');

    const nameHeader = document.createElement('h3');
    nameHeader.textContent = learner.name;
    card.appendChild(nameHeader);

    const emailParagraph = document.createElement('p');
    emailParagraph.textContent = learner.email;
    card.appendChild(emailParagraph);

    const mentorsHeader = document.createElement('h4');
    mentorsHeader.textContent = "Mentors";
    card.appendChild(mentorsHeader);

    const mentorsList = document.createElement('ul');
    learner.mentors.forEach(mentor => {
      const mentorItem = document.createElement('li');
      mentorItem.textContent = mentor;
      mentorsList.appendChild(mentorItem);
    })
    card.appendChild(mentorsList);

    const dropdownArrow = document.createElement('span');
    dropdownArrow.textContent = '▼';
    dropdownArrow.classList.add('dropdown-arrow');
    mentorsHeader.appendChild(dropdownArrow);

    card.addEventListener( 'click' , () => {
      // expand and collapse
      if (card.style.backgroundColor !== 'white') {
        card.style.backgroundColor = 'white';
        card.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.5)'; // Add drop shadow
        mentorsList.style.display = 'block'; // Expand the mentor list
      } else {
        card.style.backgroundColor = ''; // Reset background color
        card.style.boxShadow = ''; // Remove drop shadow
        dropdownArrow.style.color = ''; // Reset dropdown arrow color
        mentorsList.style.display = 'none'; // Collapse the mentor list
      }
    })

    learnersContainer.appendChild(card);

    return card;
  }

  fetchData();

  try {
    module.exports = {
      sprintChallenge5: fetchData
    }
  } catch {
    //handle error
  }
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
