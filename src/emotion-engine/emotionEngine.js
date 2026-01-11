function detectEmotion(text) {
  const emotions = {
    fear: ["scared", "afraid", "anxious", "future", "fear"],
    confusion: ["confused", "confusion", "not sure"],
    stress: ["pressure", "overwhelmed"]
  };

  for (let emotion in emotions) {
    if (emotions[emotion].some(word => text.toLowerCase().includes(word))) {
      return emotion;
    }
  }

  return "neutral";
}

      clarified_problem: problem,
      structured_options: options,
      recommended_direction: `${direction} ${shuffleArray(encouragements)[0]}`,
      next_action: options[0]
    });
  });

  return results;
}