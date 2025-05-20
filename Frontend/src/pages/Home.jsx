import CollegeCard from "../components/college/CollegeCard"
// import Comment from "../components/comment/comment"

function Home() {

  return (
    <div className="flex flex-wrap justify-center items-center gap-0.5 h-50">
      <CollegeCard imageUrl="https://imgs.search.brave.com/NouJrynPT8C7VbCBKgn3T1lnociC1S2wS02zgJe5jNk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2ZjLzEx/L2FjL2ZjMTFhYzkw/NWRhYjMxZjYwMjlj/NThiMjY5MzI0MDE3/LmpwZw" city="Mumbai" collegeName="IIT Bombay" />
    </div>
  )
}

export default Home
