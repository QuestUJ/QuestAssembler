import {
  CharacterDetails,
  MessageDetails,
  StoryChunkDetails
} from './sharedTypes';

export const PLACEHOLDER_ROOM_PLAYERS: CharacterDetails[] = [
  {
    id: 1,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 139193',
    turnSubmit: {
      content:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      timestamp: new Date()
    }
  },
  {
    id: 2,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 2',
    turnSubmit: {
      content:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      timestamp: new Date()
    }
  },
  {
    id: 3,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 3',
    turnSubmit: {
      content:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      timestamp: new Date()
    }
  },
  {
    id: 4,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 4',
    turnSubmit: {
      content:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      timestamp: new Date()
    }
  },
  {
    id: 5,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 5',
    turnSubmit: {
      content: undefined,
      timestamp: undefined
    }
  },
  {
    id: 20,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 2',
    turnSubmit: {
      content:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      timestamp: new Date()
    }
  },
  {
    id: 15,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 3',
    turnSubmit: {
      content: undefined,
      timestamp: undefined
    }
  },
  {
    id: 8,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 4',
    turnSubmit: {
      content:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      timestamp: new Date()
    }
  },
  {
    id: 100,
    pictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    name: 'Test 5',
    turnSubmit: {
      content: undefined,
      timestamp: undefined
    }
  }
];

export const PLACEHOLDER_DUMMY_MESSAGES: MessageDetails[] = [
  {
    type: 'message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    content: 'Siemano, jakaś kompresja ktoś coś?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    content: 'Siemano, może nie?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    content: 'Siemano, jakaś kompresja ktoś coś?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    content: 'Siemano, może nie?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    content: 'Siemano, jakaś kompresja ktoś coś?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    content: 'Siemano, może nie?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    content: 'Siemano, jakaś kompresja ktoś coś?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    content: 'Siemano, może nie?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    content: 'Siemano, jakaś kompresja ktoś coś?',
    timestamp: new Date()
  },
  {
    type: 'message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    content: 'Siemano, może nie?',
    timestamp: new Date()
  }
];
export const PLACEHOLDER_DUMMY_STORY: StoryChunkDetails[] = [
  {
    type: 'storychunk',
    contents:
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    imageURL: undefined
  },
  {
    type: 'storychunk',
    contents:
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
    imageURL:
      'https://i.wpimg.pl/1200x784/filerepo.grupawp.pl/api/v1/display/embed/9e90b0f2-2b2d-4841-beae-1a4531238af7'
  }
];
