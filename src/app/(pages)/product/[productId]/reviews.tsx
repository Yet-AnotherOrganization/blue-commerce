import Loader from "../../../../components/Loader";
import Review from "../../../../components/Review";
import { Prisma, Product, Review as ReviewType } from "../../../../generated/prisma";
import { prisma } from "../../../../lib/prisma";


type ReviewWithUser = Prisma.ReviewGetPayload<{
    include: { owner: true }
}>

const Reviews = async ({ currentProduct }: { currentProduct: Product | null }) => {

    const reviews = (await prisma.review.findMany({
        where: {
            productId: {
                equals: currentProduct?.id
            }
        },
        include: {
            owner: true
        }
    }));


    // Use useEffect to log the reviews whenever the reviews state changes

    return (
        <div className="flex flex-col justify-center items-center m-[2rem] gap-4">
            {
                !reviews ? <div className="py-4"><Loader /></div> : reviews && reviews.length === 0 ? <div className="py-4">No reviews were found.</div> : (
                    reviews.map((review: ReviewWithUser, i: number) => {
                        const user = review.owner;
                        return (<Review key={i} user={user} i={i} review={review} />)
                    }
                    )
                )
            }
        </div>
    );
}

export default Reviews;