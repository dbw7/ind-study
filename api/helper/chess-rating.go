package helper

import "math"

func expectedOutcome(rating1, rating2 int) float64 {
	return 1 / (1 + math.Pow(10, float64(rating2-rating1)/400))
}
func kFactor(rating int) float64 {
	switch {
	case rating < 2000:
		return 40
	case rating >= 2000 && rating < 2400:
		return 24
	default:
		return 16
	}
}

func UpdateElo(rating1 int, rating2 int, actualOutcomeForP1 float64) (int, int, int, int) {
	kFactor1 := kFactor(rating1)
	kFactor2 := kFactor(rating2)

	expected1 := expectedOutcome(rating1, rating2)
	expected2 := expectedOutcome(rating2, rating1)

	newRating1 := float64(rating1) + kFactor1*(actualOutcomeForP1-expected1)
	newRating2 := float64(rating2) + kFactor2*((1-actualOutcomeForP1)-expected2)

	rating1Int := int(math.Round(newRating1))
	rating2Int := int(math.Round(newRating2))

	elo1Change := rating1Int - rating1
	elo2Change := rating2Int - rating2

	return rating1Int, rating2Int, elo1Change, elo2Change
}
