import Thumbnail1 from './assets/flag1.jpg'
import Thumbnail2 from './assets/flag2.jpg'
import Thumbnail3 from './assets/flag3.png'
import Candidate1 from './assets/candidate1.jpg'
import Candidate2 from './assets/candidate2.jpg'
import Candidate3 from './assets/candidate3.jpg'
import Candidate4 from './assets/candidate4.jpg'
import Candidate5 from './assets/candidate5.jpg'
import Candidate6 from './assets/candidate6.jpg'
import Candidate7 from './assets/candidate7.jpg'

export const elections = [
    {
        id: "e1",
        title: "Kenya National Elections 2027",
        description: `This the machakos university elections section for the year 2025 with the given candidates`,
        thumbnail: Thumbnail1,
        candidates: ["c1", "c2", "c3", "c4"],
        voters: []
    },
    {
        id: "e2",
        title: "JKUAT University Elections 2025",
        description: `This the machakos university elections section for the year 2025 with the given candidates`,
        thumbnail: Thumbnail2,
        candidates: ["c5", "c6", "c7"],
        voters: []
    },
    {
        id: "e3",
        title: "Chuka University Elections 2025",
        description: `This the machakos university elections section for the year 2025 with the given candidates`,
        thumbnail: Thumbnail3,
        candidates: [],
        voters: []
    },
]


export const candidates = [
    {
        id: "c1",
        fullName: "Kasongo Ole Tumepamga",
        image: Candidate1,
        motto: `This is Enoch running rof presidential candidature.`,
        voteCount: 23,
        election: "e1",
    },
    {
        id: "c2",
        fullName: "Keboso Wa  Furniture",
        image: Candidate2,
        motto: `This is Enoch running rof presidential candidature.`,
        voteCount: 17,
        election: "e3",
    },
    {
        id: "c3",
        fullName: "Okiya Wa Matata",
        image: Candidate3,
        motto: `This is Enoch running rof presidential candidature.`,
        voteCount: 2,
        election: "e1",
    },
    {
        id: "c4",
        fullName: "Macoure Gen-F",
        image: Candidate4,
        motto: `This is Enoch running rof presidential candidature.`,
        voteCount: 12,
        election: "e3",
    },
    {
        id: "c4",
        fullName: "Macoure Gen-F",
        image: Candidate4,
        motto: `This is Enoch running rof presidential candidature.`,
        voteCount: 12,
        election: "e2",
    },
    {
        id: "c4",
        fullName: "Macoure Gen-F",
        image: Candidate4,
        motto: `This is Enoch running rof presidential candidature.`,
        voteCount: 12,
        election: "e1",
    },
    {
        id: "c5",
        fullName: "Matiang'a Fred",
        image: Candidate5,
        motto: `This is Enoch running rof presidential candidature.`,
        voteCount: 218,
        election: "e2",
    },
    {
        id: "c6",
        fullName: "Brian Luige",
        image: Candidate6,
        motto: `This is Brian running rof presidential candidature.`,
        voteCount: 195,
        election: "e2",
    },
    {
        id: "c7",
        fullName: "Adrian Makoth",
        image: Candidate7,
        motto: `This is Enoch running rof presidential candidature.`,
        voteCount: 301,
        election: "e3",
    },
]


export const voters = [

    {
        id: "v1",
        fullName: "Admin Main",
        email: "mainadmin@gmail.com",
        password: "admin123",
        isAdmin: "true",
        votedElections: []
    },

    {
        id: "v2",
        fullName: "Stanley Partey",
        email: "stanleyparety2@gmail.com",
        password: "stanleyl123",
        isAdmin: "false",
        votedElections: ["e1", "e2"]
    },

    {
        id: "v3",
        fullName: "Daniel Yogo",
        email: "danieleyogo67@gmail.com",
        password: "daniel123",
        isAdmin: "false",
        votedElections: ["e1", "e2"]
    },
    {
        id: "v4",
        fullName: "Diana Ayi",
        email: "diana@gmail.com",
        password: "diana123",
        isAdmin: "true",
        votedElections: []
    },
]