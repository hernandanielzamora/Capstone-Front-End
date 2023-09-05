import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches } from '../redux/branchesSlice';
import { fetchRooms } from '../redux/branchRoomSlice'; // Updated import
import '../styles/Home.scss';
import Card from './Card';
import '../styles/Reservations.css';

const AddReservation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const branches = useSelector((state) => state.branches.data);
  const selectedBranchId = useSelector((state) => state.branchRoom.selectedBranchId);
  const rooms = useSelector((state) => state.branchRoom.data); // Updated selector
  const pendingReservation = useSelector((state) => state.pendingReservation.reservation);

  const handleBranchChange = (event) => {
    const selectedBranchId = event.target.value;
    dispatch(fetchRooms(selectedBranchId));
  };

  return (
    <>
      <section className="home-container">
        <h1 className="home-title">Reserve your Suite</h1>
        <p className="home-brief">Please select where you want to stay</p>
        <select value={selectedBranchId} onChange={handleBranchChange}>
          <option value="">Select a Branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.city}
            </option>
          ))}
        </select>
        {selectedBranchId && (
          <div>
            <h2>
              Our Rooms
            </h2>
            <div className="react-multi-carousel-item ma-25px">
              {rooms.map((room) => (
                <Card
                  id={room.id}
                  key={room.id}
                  name={room.name}
                  description={room.description}
                  cost={room.cost}
                  photo={room.photo}
                  showAddToReservationButton
                />
              ))}
            </div>
          </div>
        )}
        <div className="reservation-data-container">
          <p>
            Total:
            {pendingReservation.totalCost}
          </p>
        </div>
      </section>
    </>
  );
};

export default AddReservation;
