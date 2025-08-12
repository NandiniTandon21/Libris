import { useEffect, useState } from "react";
import {
  Clock,
  Timer,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import {
  returnRental,
  updatePenalties,
  selectUserCurrentPenalties,
} from "../store/slices/rentalsSlice";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { returnBook, syncBooksWithRentals } from "../store/slices/booksSlice";

function SimplePenaltyPayment(props: { totalPenalties: number }) {
  return null;
}

export default function Rentals() {
  const dispatch = useAppDispatch();
  const { rentals } = useAppSelector((state) => state.rentals);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { user } = useAppSelector((state) => state.auth);
  const userCurrentPenalties = useAppSelector((state) =>
    user ? selectUserCurrentPenalties(state, user.id) : 0,
  );

  useEffect(() => {
    // Update current time every second for real-time countdown
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      dispatch(updatePenalties());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const activeRentals = rentals.filter(
    (rental) => !rental.returnedAt && rental.userId === user?.id,
  );
  const completedRentals = rentals.filter(
    (rental) => rental.returnedAt && rental.userId === user?.id,
  );

  const handleReturnBook = (
    rentalId: string,
    bookId: number,
    bookTitle: string,
  ) => {
    dispatch(returnRental(rentalId));
    dispatch(returnBook(bookId));

    // Sync books with updated rentals
    setTimeout(() => {
      const updatedActiveRentals = rentals.filter(
        (rental) => rental.id !== rentalId && !rental.returnedAt,
      );
      dispatch(syncBooksWithRentals(updatedActiveRentals));
    }, 100);

    toast.success(`Successfully returned "${bookTitle}"`);
  };

  const formatTimeRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const diff = due.getTime() - currentTime.getTime();

    if (diff <= 0) {
      const overdue = currentTime.getTime() - due.getTime();
      const hoursOverdue = Math.floor(overdue / (1000 * 60 * 60));
      const minutesOverdue = Math.floor(
        (overdue % (1000 * 60 * 60)) / (1000 * 60),
      );
      const secondsOverdue = Math.floor((overdue % (1000 * 60)) / 1000);

      if (hoursOverdue > 0) {
        return {
          text: `${hoursOverdue}h ${minutesOverdue}m overdue`,
          isOverdue: true,
        };
      } else if (minutesOverdue > 0) {
        return {
          text: `${minutesOverdue}m ${secondsOverdue}s overdue`,
          isOverdue: true,
        };
      } else {
        return { text: `${secondsOverdue}s overdue`, isOverdue: true };
      }
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return { text: `${hours}h ${minutes}m ${seconds}s`, isOverdue: false };
    } else if (minutes > 0) {
      return { text: `${minutes}m ${seconds}s`, isOverdue: false };
    } else {
      return { text: `${seconds}s`, isOverdue: false };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
          <p className="text-gray-600">Track your rented books and due dates</p>
          <p className="text-sm text-orange-600 mt-1">
            ⚠️ TEST MODE: Books become overdue in 10 seconds
          </p>
        </div>
        <Link to="/">
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Books</span>
          </Button>
        </Link>
      </div>

      {/* Penalty Payment Section */}
      <SimplePenaltyPayment totalPenalties={userCurrentPenalties} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Rentals
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeRentals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedRentals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Penalties
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{userCurrentPenalties}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Rentals */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Timer className="w-5 h-5" />
          <span>Active Rentals ({activeRentals.length})</span>
        </h2>

        {activeRentals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active rentals
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't rented any books yet
              </p>
              <Link to="/">
                <Button>Browse Books</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeRentals.map((rental) => {
              const timeRemaining = formatTimeRemaining(rental.dueAt);
              return (
                <Card
                  key={rental.id}
                  className={
                    timeRemaining.isOverdue
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200"
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-900">
                          {rental.bookTitle}
                        </CardTitle>
                        <CardDescription>
                          Rental ID: {rental.id.split("-")[1]}
                        </CardDescription>
                      </div>
                      {rental.penalty > 0 && (
                        <Badge
                          variant="destructive"
                          className="flex items-center space-x-1"
                        >
                          <IndianRupee className="w-3 h-3" />
                          <span>{rental.penalty}</span>
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Rented:</span>
                        <span className="font-medium">
                          {formatDate(rental.rentedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Due:</span>
                        <span className="font-medium">
                          {formatDate(rental.dueAt)}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {timeRemaining.isOverdue ? (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-green-600" />
                          )}
                          <span
                            className={`font-medium ${timeRemaining.isOverdue ? "text-red-600" : "text-green-600"}`}
                          >
                            {timeRemaining.text}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          onClick={() =>
                            handleReturnBook(
                              rental.id,
                              rental.bookId,
                              rental.bookTitle,
                            )
                          }
                          className="bg-gradient-to-r from-libris-950 to-libris-700 hover:from-libris-900 hover:to-libris-600 text-white"
                        >
                          Return Book
                        </Button>
                      </div>

                      {timeRemaining.isOverdue && rental.penalty > 0 && (
                        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <p className="text-sm text-red-800">
                              Current penalty: ₹{rental.penalty} (₹5 per hour)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Rentals */}
      {completedRentals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Rental History ({completedRentals.length})</span>
          </h2>

          <div className="space-y-3">
            {completedRentals.slice(0, 5).map((rental) => (
              <Card key={rental.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {rental.bookTitle}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(rental.rentedAt)} -{" "}
                        {formatDate(rental.returnedAt!)}
                      </p>
                      {rental.penaltyPaid > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          Penalty paid: ₹{rental.penaltyPaid}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Returned
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {completedRentals.length > 5 && (
              <div className="text-center">
                <Button variant="outline">
                  View All History ({completedRentals.length} total)
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}