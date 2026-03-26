const fs = require('fs');
let file = fs.readFileSync('screens/Screen7.tsx', 'utf8');

file = file.replace(
`  // BACKEND: GET /api/courses
  // Endpoint to fetch available courses and learning paths.
  // Query params: ?search={searchTerm}&category={categoryId}
  // Response: {
  //   courses: Array<{ id: string, title: string, desc: string, icon: string, color: string, users: number }>,
  //   paths: Array<{ id: string, title: string, coursesCount: number, hoursCount: number, image: string }>
  // }
  /*
  useEffect(() => {
    // try {
    //   const data = await axios.get('/api/courses');
    //   setCoursesData(data);
    // } catch (e) { ... }
  }, [searchQuery, activeFilter]);
  */

  const handleStartCourse = () => {
    // BACKEND INTEGRATION POINT: POST /api/user/enroll
    // await axios.post('/api/user/enroll', { courseId });
    navigation.navigate('Map');
  };`,
`  React.useEffect(() => {
    async function fetchCourses() {
      try {
        // BACKEND INTEGRATION POINT:
        // const problems = await api.get('/api/v1/problems');
        // const grammar = await api.get('/api/v1/grammar/assessments');
        // setCourses([...problems, ...grammar]);
      } catch (e) {
        console.error('Failed to fetch courses', e);
      }
    }
    fetchCourses();
  }, []);

  const handleStartCourse = async () => {
    // BACKEND INTEGRATION POINT: POST /api/user/enroll
    // await api.post('/api/user/enroll', { courseId: 'js-101' });
    navigation.navigate('Map');
  };`
);

fs.writeFileSync('screens/Screen7.tsx', file);
