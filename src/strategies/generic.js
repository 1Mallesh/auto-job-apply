// strategies/generic.js
export default async (page, user) => {
  try {
    console.log("Generic handler");

    // You can customize based on selectors
    return { status: "pending", message: "Manual review needed" };

  } catch (err) {
    return { status: "failed" };
  }
};