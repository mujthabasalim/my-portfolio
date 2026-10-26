export default async function handler(req, res) {
  const username = req.query.username || "mujthabasalim";

  try {
    const response = await fetch(
      `https://github-contributions-api.deno.dev/${username}.json`,
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch github" });
    }

    const data = await response.json();

    // Cache for 1 hour to avoid hitting the API too often
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
