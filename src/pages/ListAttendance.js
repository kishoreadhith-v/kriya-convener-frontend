
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { fetchAttendees, fetchAttendeesPaper, fetchAttendeesWorkshop } from "../API/calls"

const ListAttendance = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [search, setSearch] = useState("")
  const [selectAll, setSelectAll] = useState(false)
  const user = localStorage.getItem("user")

  useEffect(() => {
    const fetchData =
      user.charAt(0) === "E" ? fetchAttendees : user.charAt(0) === "P" ? fetchAttendeesPaper : fetchAttendeesWorkshop
    console.log(fetchData === fetchAttendeesWorkshop)
    console.log(user)
    toast.promise(
      fetchData(user).then((res) => {
        setData(res.data)
        setFilteredData(res.data)
        return "Success"
      }),
      {
        loading: "Loading...",
        success: "Data loaded successfully!",
        error: "Error fetching data",
      },
    )
  }, [user])

  useEffect(() => {
    if (!data.length) return

    if (!search.trim()) {
      setFilteredData(data)
      return
    }

    const searchTerm = search.trim().toLowerCase()

    const filtered = data.filter((item) => {
      const kriyaId = (item.kriyaId || "").toLowerCase()
      const name = (item.name || "").toLowerCase()
      const email = (item.email || "").toLowerCase()
      const phone = (item.phone || "").toString().toLowerCase()
      const roundLevel = (item.roundLevel || "").toString().toLowerCase()

      return (
        kriyaId.includes(searchTerm) ||
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        roundLevel.includes(searchTerm)
      )
    })

    setFilteredData(filtered)
  }, [search, data])

  const handleCheckboxChange = (participant) => {
    setSelectedParticipants((prev) => {
      const newSelection = prev.includes(participant.email)
        ? prev.filter((email) => email !== participant.email)
        : [...prev, participant.email]

      setSelectAll(
        filteredData.length > 0 &&
        newSelection.length === filteredData.length &&
        filteredData.every((item) => newSelection.includes(item.email)),
      )

      return newSelection
    })
  }

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedParticipants((prev) => prev.filter((email) => !filteredData.some((item) => item.email === email)))
      setSelectAll(false)
    } else {
      const filteredEmails = filteredData.map((item) => item.email)
      setSelectedParticipants((prev) => {
        const currentEmails = new Set(prev)
        filteredEmails.forEach((email) => currentEmails.add(email))
        return Array.from(currentEmails)
      })
      setSelectAll(true)
    }
  }

  const handlePromoteClick = async () => {
    if (selectedParticipants.length === 0) {
      toast.error("Please select at least one participant.")
      return
    }

    const eventId = localStorage.getItem("user")

    const selectedParticipant = data.find((p) => p.email === selectedParticipants[0])
    if (!selectedParticipant) {
      toast.error("Selected participant not found.")
      return
    }

    const round = selectedParticipant.roundLevel + 1

    try {
      const response = await axios.post(
        "https://kriyaconvenordb.psgtech.ac.in/update-round-userlist",
        {
          eventId,
          emailList: selectedParticipants,
          round: round,
        },
        { headers: { "Content-Type": "application/json" } },
      )

      toast.success("Selected participants promoted successfully!")
      setTimeout(() => {
        window.location.reload()  // Auto-reload after promotion
      }, 1500)
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.error || "Error updating event details")
    }
  }

  return (
    <div className="h-full w-full font-poppins pb-16 px-4">
      <h1 className="text-4xl font-semibold text-sky-900 mb-6">Participants List</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {!data.length ? (
        <h1 className="text-3xl font-semibold">Loading...</h1>
      ) : (
        <div className="w-full">
          {/* Scrollable container including header */}
          <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-[50px_150px_200px_150px_250px_150px] gap-4 p-3 bg-gray-200 font-semibold text-lg">
                <div className="flex items-center justify-center">
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} className="w-4 h-4" />
                </div>
                <h1 className="text-left">Kriya ID</h1>
                <h1 className="text-left">Name</h1>
                <h1 className="hidden lg:block text-left">Mobile</h1>
                <h1 className="hidden lg:block text-left">Email</h1>
                <h1 className="text-left">Round Level</h1>
              </div>

              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div
                    key={item.email}
                    className="grid grid-cols-[50px_150px_200px_150px_250px_150px] gap-4 p-3 border-b border-gray-300 items-center"
                  >
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(item.email)}
                        onChange={() => handleCheckboxChange(item)}
                        className="w-4 h-4"
                      />
                    </div>
                    <p className="truncate">{item.kriyaId}</p>
                    <p className="truncate">{item.name}</p>
                    <p className="hidden lg:block truncate">{item.phone}</p>
                    <p className="hidden lg:block truncate">{item.email}</p>
                    <p className="truncate">{item.roundLevel}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No participants found matching your search.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedParticipants.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={handlePromoteClick}
          >
            Promote Selected ({selectedParticipants.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default ListAttendance
