async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇

  const footer = document.querySelector('footer')
  const currentYear = new Date().getFullYear()
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`

  const learnersContainer = document.querySelector('.cards');
  const errorMessage = 'Something is wrong';

  async function fetchData() {
    try {
      const [learnersResponse, mentorsResponse] = await Promise.all([
        axios.get('http://localhost:3003/api/learners'),
        axios.get('http://localhost:3003/api/mentors'),
      ]);

      // Process the data
      const learners = learnersResponse.data;
      const mentors = mentorsResponse.data;

      const mentorsMap = new Map();
      mentors.forEach(mentor => {
        mentorsMap.set(mentor.id, mentor);
      });

      // Array to store the combined learner data
      const combinedData = learners.map(learner => {
        const learnerInfo = {
          id: learner.id,
          name: learner.fullName,
          email: learner.email,
          mentors: learner.mentors.map(mentorId => {
            const mentor = mentors.find(m => m.id === mentorId);
            return mentor ? `${mentor.firstName} ${mentor.lastName}` : 'Unknown Mentor';
          }),
        };
        return learnerInfo;
      });

      learnersContainer.textContent = '';

      const infoParagraph = document.querySelector('.info'); // Select the info paragraph

      combinedData.forEach(learner => {
        const learnerCard = createLearnerCard(learner, infoParagraph);
      });
    } catch (error) {
      footer.textContent = errorMessage;
    }
  }

  function createLearnerCard(learner, infoParagraph) {
    const card = document.createElement('div');
    card.classList.add('card');

    const nameHeader = document.createElement('h3');
    nameHeader.textContent = learner.name;
    card.appendChild(nameHeader);

    const emailParagraph = document.createElement('p');
    emailParagraph.textContent = learner.email;
    card.appendChild(emailParagraph);

    const mentorsHeader = document.createElement('h4');
    mentorsHeader.textContent = 'Mentors';
    mentorsHeader.classList.add('closed'); // Initially, set it to 'closed'
    card.appendChild(mentorsHeader);

    const mentorsList = document.createElement('ul');
    learner.mentors.forEach(mentor => {
      const mentorItem = document.createElement('li');
      mentorItem.textContent = mentor;
      mentorsList.appendChild(mentorItem);
    });
    card.appendChild(mentorsList);

    mentorsHeader.addEventListener('click', () => {
      if (mentorsHeader.classList.contains('closed')) {
        mentorsHeader.classList.remove('closed');
        mentorsHeader.classList.add('open');
      } else {
        mentorsHeader.classList.remove('open');
        mentorsHeader.classList.add('closed');
      }
    });

    // Uncomment the following code to add a dropdown arrow
    // const dropdownArrow = document.createElement('span');
    // dropdownArrow.textContent = '▼';
    // dropdownArrow.classList.add('dropdown-arrow');
    // mentorsHeader.appendChild(dropdownArrow);

    card.addEventListener('click', () => {
      if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        infoParagraph.textContent = 'No learner is selected';
      } else {
        card.classList.add('selected');
        infoParagraph.textContent = `The selected learner is ${learner.name}`;
      }
    });

    learnersContainer.appendChild(card);

    return card;
  }

  fetchData();
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
