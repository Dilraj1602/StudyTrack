/**
 * Tracking Controller
 * 
 * Provides AI-powered study insights and analytics using Gemini AI.
 * Analyzes user study patterns, task completion rates, and generates
 * personalized recommendations for academic improvement.
 * 
 * Features:
 * - AI-generated insights across 6 categories
 * - Study statistics and performance metrics
 * - Study streak calculation
 * - Monthly progress tracking
 * - Fallback insights when AI is unavailable
 * 
 * @author StudyTrack Team
 * @version 1.0.0
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Task = require('../models/Task');
const User = require('../models/User');

// Helper function to parse duration from various types
const parseDuration = (duration) => {
  console.log('parseDuration called with:', duration, 'type:', typeof duration);
  
  if (typeof duration === 'number' && !isNaN(duration)) {
    console.log('Duration is number:', duration);
    return duration;
  } else if (typeof duration === 'string') {
    console.log('Duration is string:', duration);
    // Handle HH:MM:SS format (e.g., "05:03:00")
    if (duration.includes(':')) {
      const parts = duration.split(':');
      console.log('Duration parts:', parts);
      if (parts.length === 3) {
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;
        const seconds = parseInt(parts[2], 10) || 0;
        
        // Convert to total hours (decimal)
        const totalHours = hours + (minutes / 60) + (seconds / 3600);
        console.log('Parsed duration:', { hours, minutes, seconds, totalHours });
        return !isNaN(totalHours) && totalHours > 0 ? totalHours : 0;
      }
    }
    
    // Fallback to simple number parsing
    const parsed = parseFloat(duration);
    console.log('Fallback parsed duration:', parsed);
    return !isNaN(parsed) && parsed > 0 ? parsed : 0;
  }
  console.log('Duration is invalid, returning 0');
  return 0; // Default fallback
};

// Helper function to calculate average hours for a time interval
const calculateAverageHours = (intervalData) => {
  const entries = Object.values(intervalData);
  if (entries.length === 0) return 0;
  
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const average = totalHours / entries.length;
  
  return Math.round(average * 10) / 10; // Round to 1 decimal place
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-pro";

// Function to clean and validate study stats data for AI insights
function cleanStudyStatsData(data) {
  try {
    if (!data || typeof data !== 'object') {
      return null;
    }

    // Clean time intervals
    const cleanTimeIntervals = {};
    Object.keys(data.timeIntervals || {}).forEach(key => {
      const interval = data.timeIntervals[key];
      if (interval && typeof interval === 'object') {
        cleanTimeIntervals[key] = {};
        Object.keys(interval).forEach(subKey => {
          const subData = interval[subKey];
          if (subData && typeof subData === 'object' && 
              typeof subData.hours === 'number' && !isNaN(subData.hours) &&
              typeof subData.tasks === 'number' && !isNaN(subData.tasks)) {
            cleanTimeIntervals[key][subKey] = {
              hours: subData.hours,
              tasks: subData.tasks
            };
          }
        });
      }
    });

    // Clean totals
    const cleanTotals = {
      hours: typeof data.totals?.hours === 'number' && !isNaN(data.totals.hours) ? data.totals.hours : 0,
      tasks: typeof data.totals?.tasks === 'number' && !isNaN(data.totals.tasks) ? data.totals.tasks : 0
    };

    // Clean study patterns
    const cleanStudyPatterns = {
      peakHours: Array.isArray(data.studyPatterns?.peakHours) ? data.studyPatterns.peakHours.filter(hour => 
        typeof hour.hour === 'number' && !isNaN(hour.hour) &&
        typeof hour.hours === 'number' && !isNaN(hour.hours) &&
        typeof hour.tasks === 'number' && !isNaN(hour.tasks)
      ) : [],
      avgDailyHours: typeof data.studyPatterns?.avgDailyHours === 'number' && !isNaN(data.studyPatterns.avgDailyHours) ? data.studyPatterns.avgDailyHours : 0,
      avgDailyTasks: typeof data.studyPatterns?.avgDailyTasks === 'number' && !isNaN(data.studyPatterns.avgDailyTasks) ? data.studyPatterns.avgDailyTasks : 0,
      totalStudyDays: typeof data.studyPatterns?.totalStudyDays === 'number' && !isNaN(data.studyPatterns.totalStudyDays) ? data.studyPatterns.totalStudyDays : 0
    };

    return {
      timeIntervals: cleanTimeIntervals,
      totals: cleanTotals,
      productivityScore: typeof data.productivityScore === 'number' && !isNaN(data.productivityScore) ? data.productivityScore : 0,
      consistencyLevel: data.consistencyLevel || 'Medium',
      studyPatterns: cleanStudyPatterns,
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error cleaning study stats data:', error);
    return null;
  }
}

// Function to generate AI insights from study data
async function generateAIInsights(userData, studyStatsData, tasks) {
  try {
    // Validate input data
    if (!userData || !studyStatsData) {
      console.error('Invalid data passed to generateAIInsights:', { userData, studyStatsData });
      throw new Error('Invalid user data or study stats data');
    }

    // Clean and validate study stats data
    const cleanedData = cleanStudyStatsData(studyStatsData);
    if (!cleanedData) {
      throw new Error('Failed to clean study stats data');
    }

    // Prepare task details for AI analysis
    const taskDetails = tasks.map(task => ({
      title: task.title || 'Untitled Task',
      description: task.description || 'No description',
      duration: task.duration,
      completed: task.completed,
      createdAt: task.createdAt,
      subject: task.subject || 'General',
      priority: task.priority || 'Medium'
    }));

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    console.log("⚡ Using Gemini model:", MODEL_NAME);


    const prompt = `
    Analyze the following comprehensive study statistics and provide insights in these 6 categories:

    USER DATA:
    - Name: ${userData.firstName} ${userData.lastName}
    - Email: ${userData.email}
    - Member since: ${new Date(userData.createdAt).toLocaleDateString()}

    TASK DETAILS (${tasks.length} tasks):
    ${JSON.stringify(taskDetails, null, 2)}

    STUDY STATISTICS DATA (Structured by time intervals):
    ${JSON.stringify(cleanedData, null, 2)}

    Please provide insights in this exact JSON format:
    {
      "performanceOverview": {
        "totalStudyHours": "X hours",
        "weeklyReport": "Analysis of weekly study patterns and trends",
        "monthlyReport": "Analysis of monthly study patterns and trends", 
        "sixMonthlyReport": "Analysis of 6-month study patterns and trends",
        "yearlyReport": "Analysis of yearly study patterns and trends",
        "summary": "Brief overview of performance based on time intervals"
      },
      "strengthsWeaknesses": {
        "strengths": ["Subject 1", "Subject 2"],
        "weaknesses": ["Subject 1", "Subject 2"],
        "analysis": "Analysis of strengths and areas for improvement based on patterns"
      },
      "productivityInsights": {
        "dataDrivenInsights": "Specific insights derived from the actual study data patterns",
        "studyPatterns": "Detailed analysis of study patterns from the data",
        "recommendations": "Actionable recommendations based on data analysis"
      },
      "learningEfficiency": {
        "retention": "High/Medium/Low based on data patterns",
        "efficiencyScore": "Calculated efficiency score from study data",
        "improvementAreas": "Specific areas for improvement based on data analysis"
      },
      "aiFeedback": {
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
        "strategies": "Personalized study strategy suggestions based on patterns"
      },
      "competitiveBenchmarking": {
        "currentRank": "Top X%",
        "improvementAreas": ["Area 1", "Area 2"],
        "top1PercentPath": "Steps to reach top 1% based on current performance"
      }
    }

    Focus on providing actionable, specific insights based on the actual data provided. Analyze:
    - Weekly patterns and trends from the weekly data, including average weekly study hours
    - Monthly patterns and trends from the monthly data, including average monthly study hours
    - 6-month patterns and trends from the sixMonthly data, including average six-month study hours
    - Yearly patterns and trends from the yearly data, including average yearly study hours
    - Hourly patterns to identify peak study hours
    - Daily consistency patterns
    - Productivity scores and study patterns
    - Time distribution across different intervals
    - Compare averages across time periods to identify trends and patterns
    - Analyze task completion rates and study subjects
    - Consider task priorities and durations for insights

    For Productivity Insights and Learning Efficiency, provide specific insights derived from the actual data patterns, not generic metrics. Base all analysis on the concrete data provided.

    IMPORTANT: Use the actual numbers from the data. If totalStudyHours is 10.1, say "10.1 hours", not "X hours". If there are specific subjects mentioned in tasks, use them in strengths/weaknesses.

    If data is limited, provide general recommendations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('AI generation error:', error);
    // Return default insights if AI fails
    return getDefaultInsights(userData, studyStatsData, tasks);
  }
}

// Function to get default insights when AI fails
function getDefaultInsights(userData, studyStatsData, tasks) {
  const { totals, productivityScore, studyPatterns } = studyStatsData;
  
  return {
    performanceOverview: {
      totalStudyHours: `${totals.hours} hours`,
      weeklyReport: "Weekly study patterns show consistent engagement",
      monthlyReport: "Monthly trends indicate steady progress",
      sixMonthlyReport: "6-month overview shows sustained study habits",
      yearlyReport: "Yearly progress demonstrates commitment to learning",
      summary: `You have studied ${totals.hours} hours with ${totals.tasks} tasks completed.`
    },
    strengthsWeaknesses: {
      strengths: ["Study consistency", "Task management"],
      weaknesses: ["Time optimization", "Study depth"],
      analysis: "Focus on optimizing study time distribution and deepening subject understanding."
    },
    productivityInsights: {
      dataDrivenInsights: `Based on your data: ${studyPatterns.totalStudyDays} active study days with ${studyPatterns.avgDailyHours}h average per day`,
      studyPatterns: `Your study patterns show ${studyPatterns.avgDailyTasks} tasks per day with peak activity during focused hours`,
      recommendations: "Optimize your peak study hours and maintain consistent daily engagement"
    },
    learningEfficiency: {
      retention: productivityScore > 70 ? "High" : productivityScore > 40 ? "Medium" : "Low",
      efficiencyScore: `${productivityScore}% based on consistency and task distribution`,
      improvementAreas: "Focus on consistent daily study habits and optimal time management"
    },
    aiFeedback: {
      recommendations: [
        "Set smaller, achievable study goals",
        "Use the Pomodoro technique for better focus",
        "Study during your peak hours consistently",
        "Maintain daily study routines"
      ],
      strategies: "Focus on consistency and gradual improvement in study habits."
    },
    competitiveBenchmarking: {
      currentRank: productivityScore > 80 ? "Top 20%" : productivityScore > 60 ? "Top 40%" : "Top 60%",
      improvementAreas: ["Study consistency", "Time optimization"],
      top1PercentPath: "Maintain 90%+ daily consistency and optimize study time distribution for 6 months"
    }
  };
}

// Main tracking controller
exports.getTrackingInsights = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware

    // Get user data with only essential fields
    const user = await User.findById(userId).select('firstName lastName email createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's tasks with all fields for processing
    const tasks = await Task.find({ user: userId })
      .select('title description subject priority duration completed createdAt updatedAt date')
      .sort({ createdAt: -1 });
    
    if (tasks.length === 0) {
      return res.json({
        message: 'No study data available yet. Start adding tasks to get AI insights!',
        insights: getDefaultInsights(user, { 
          totals: { hours: 0, tasks: 0 }, 
          productivityScore: 0, 
          studyPatterns: {} 
        }, []),
        hasData: false
      });
    }

    // Create study statistics data directly from tasks
    const studyStatsData = createStudyStatsData(tasks);
    
        console.log('=== SERVER SIDE DEBUG ===');
    console.log('User Data:', user);
    console.log('Study Stats Data:', studyStatsData);
    console.log('Tasks Count:', tasks.length);
    console.log('Sample Task Data:', tasks[0]);
    console.log('Task Duration Sample:', tasks[0]?.duration);
    console.log('Parsed Duration Sample:', parseDuration(tasks[0]?.duration));
    console.log('========================');

    // Generate AI insights with study data
    let insights;
    try {
      insights = await generateAIInsights(user, studyStatsData, tasks);
    } catch (error) {
      console.error('AI insights generation failed:', error);
      // Fallback to default insights if AI fails
      insights = getDefaultInsights(user, studyStatsData, tasks);
    }

    res.json({
      message: 'AI insights generated successfully',
      insights,
      hasData: true,
      dataSummary: {
        totalTasks: tasks.length,
        totalStudyTime: studyStatsData.totals.hours,
        lastActivity: tasks[0]?.createdAt
      }
    });

  } catch (error) {
    console.error('Tracking insights error:', error);
    res.status(500).json({ 
      message: 'Failed to generate insights',
      insights: getDefaultInsights({ firstName: 'User', lastName: '', email: '', createdAt: new Date() }, { 
        totals: { hours: 0, tasks: 0 }, 
        productivityScore: 0, 
        studyPatterns: {} 
      }, []),
      hasData: false
    });
  }
};

// Helper function to create study statistics data from tasks
function createStudyStatsData(tasks) {
  const intervals = {
    hourly: {},
    daily: {},
    weekly: {},
    monthly: {},
    sixMonthly: {},
    yearly: {},
    total: {
      hours: 0,
      tasks: 0
    }
  };

  // Validate tasks array
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return {
      timeIntervals: intervals,
      totals: intervals.total,
      productivityScore: 0,
      studyPatterns: {
        peakHours: [],
        avgDailyHours: 0,
        avgDailyTasks: 0,
        totalStudyDays: 0
      },
      lastUpdated: new Date().toISOString()
    };
  }

  tasks.forEach(task => {
    // Validate task data
    if (!task || (!task.createdAt && !task.date)) {
      return; // Skip invalid tasks
    }

    // Use createdAt if available, otherwise fall back to date field
    const taskDate = task.createdAt ? new Date(task.createdAt) : new Date(task.date);
    
    // Validate date
    if (isNaN(taskDate.getTime())) {
      return; // Skip tasks with invalid dates
    }

    const taskHour = taskDate.getHours();
    const taskDay = taskDate.toDateString();
    const taskWeek = getWeekNumber(taskDate);
    const taskMonth = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;
    const taskSixMonth = `${taskDate.getFullYear()}-${Math.floor(taskDate.getMonth() / 6) + 1}`;
    const taskYear = taskDate.getFullYear();

    // Parse duration using helper function
    const duration = parseDuration(task.duration);
    console.log('Task duration parsed:', duration, 'for task:', task.title || 'Untitled');

    // Hourly stats
    if (!intervals.hourly[taskHour]) {
      intervals.hourly[taskHour] = { hours: 0, tasks: 0 };
    }
    intervals.hourly[taskHour].hours += duration;
    intervals.hourly[taskHour].tasks += 1;

    // Daily stats
    if (!intervals.daily[taskDay]) {
      intervals.daily[taskDay] = { hours: 0, tasks: 0 };
    }
    intervals.daily[taskDay].hours += duration;
    intervals.daily[taskDay].tasks += 1;

    // Weekly stats
    if (!intervals.weekly[taskWeek]) {
      intervals.weekly[taskWeek] = { hours: 0, tasks: 0 };
    }
    intervals.weekly[taskWeek].hours += duration;
    intervals.weekly[taskWeek].tasks += 1;

    // Monthly stats
    if (!intervals.monthly[taskMonth]) {
      intervals.monthly[taskMonth] = { hours: 0, tasks: 0 };
    }
    intervals.monthly[taskMonth].hours += duration;
    intervals.monthly[taskMonth].tasks += 1;

    // 6-Monthly stats
    if (!intervals.sixMonthly[taskSixMonth]) {
      intervals.sixMonthly[taskSixMonth] = { hours: 0, tasks: 0 };
    }
    intervals.sixMonthly[taskSixMonth].hours += duration;
    intervals.sixMonthly[taskSixMonth].tasks += 1;

    // Yearly stats
    if (!intervals.yearly[taskYear]) {
      intervals.yearly[taskYear] = { hours: 0, tasks: 0 };
    }
    intervals.yearly[taskYear].hours += duration;
    intervals.yearly[taskYear].tasks += 1;

    // Total stats
    intervals.total.hours += duration;
    intervals.total.tasks += 1;
  });

  // Calculate productivity score
  const productivityScore = calculateProductivityScore(intervals);
  
  // Analyze study patterns
  const studyPatterns = analyzeStudyPatterns(intervals);

  // Calculate averages for each time interval
  const weeklyAverage = calculateAverageHours(intervals.weekly);
  const monthlyAverage = calculateAverageHours(intervals.monthly);
  const sixMonthlyAverage = calculateAverageHours(intervals.sixMonthly);
  const yearlyAverage = calculateAverageHours(intervals.yearly);

  console.log('Final intervals totals:', intervals.total);
  console.log('Productivity score:', productivityScore);
  console.log('Study patterns:', studyPatterns);

  return {
    timeIntervals: {
      hourly: intervals.hourly,
      daily: intervals.daily,
      weekly: intervals.weekly,
      monthly: intervals.monthly,
      sixMonthly: intervals.sixMonthly,
      yearly: intervals.yearly
    },
    totals: intervals.total,
    productivityScore,
    studyPatterns,
    lastUpdated: new Date().toISOString(),
    // Add average calculations for AI insights
    averages: {
      weekly: weeklyAverage,
      monthly: monthlyAverage,
      sixMonthly: sixMonthlyAverage,
      yearly: yearlyAverage
    }
  };
}

// Helper function to get week number
function getWeekNumber(date) {
  try {
    if (!date || isNaN(date.getTime())) {
      return 'Invalid-Week';
    }
    
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    
    if (isNaN(weekNum)) {
      return 'Invalid-Week';
    }
    
    return `${d.getUTCFullYear()}-W${weekNum}`;
  } catch (error) {
    console.error('Error calculating week number:', error);
    return 'Invalid-Week';
  }
}

// Helper function to calculate productivity score
function calculateProductivityScore(intervals) {
  try {
    const dailyValues = Object.values(intervals.daily);
    if (dailyValues.length === 0) return 0;

    const consistency = dailyValues.filter(day => day.tasks > 0).length / dailyValues.length;
    const avgTasksPerDay = dailyValues.reduce((sum, day) => sum + day.tasks, 0) / dailyValues.length;
    
    const score = Math.round((consistency * 0.6 + avgTasksPerDay * 0.4) * 100);
    return isNaN(score) ? 0 : Math.max(0, Math.min(100, score));
  } catch (error) {
    console.error('Error calculating productivity score:', error);
    return 0;
  }
}

// Helper function to analyze study patterns
function analyzeStudyPatterns(intervals) {
  try {
    const hourlyData = intervals.hourly;
    const peakHours = Object.entries(hourlyData)
      .filter(([hour, data]) => !isNaN(parseInt(hour)) && data && typeof data.hours === 'number' && !isNaN(data.hours))
      .sort(([,a], [,b]) => b.hours - a.hours)
      .slice(0, 3)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        hours: data.hours,
        tasks: data.tasks
      }));

    const dailyData = Object.values(intervals.daily).filter(day => day && typeof day.hours === 'number' && !isNaN(day.hours));
    
    let avgDailyHours = 0;
    let avgDailyTasks = 0;
    
    if (dailyData.length > 0) {
      const totalHours = dailyData.reduce((sum, day) => sum + day.hours, 0);
      const totalTasks = dailyData.reduce((sum, day) => sum + day.tasks, 0);
      
      avgDailyHours = totalHours / dailyData.length;
      avgDailyTasks = totalTasks / dailyData.length;
    }

    return {
      peakHours: peakHours || [],
      avgDailyHours: isNaN(avgDailyHours) ? 0 : Math.round(avgDailyHours * 10) / 10,
      avgDailyTasks: isNaN(avgDailyTasks) ? 0 : Math.round(avgDailyTasks * 10) / 10,
      totalStudyDays: dailyData.filter(day => day.tasks > 0).length
    };
  } catch (error) {
    console.error('Error analyzing study patterns:', error);
    return {
      peakHours: [],
      avgDailyHours: 0,
      avgDailyTasks: 0,
      totalStudyDays: 0
    };
  }
}

// Get user's study statistics (simplified version without Redux)
exports.getStudyStats = async (req, res) => {
  try {
    const userId = req.user;
    
    const tasks = await Task.find({ user: userId });
    
    const stats = {
      totalTasks: tasks.length,
      totalStudyHours: tasks.reduce((sum, task) => sum + parseDuration(task.duration), 0),
      averageTaskDuration: tasks.length > 0 ? Math.round(tasks.reduce((acc, task) => acc + parseDuration(task.duration), 0) / tasks.length) : 0,
      studyStreak: calculateStudyStreak(tasks),
      monthlyProgress: getMonthlyProgress(tasks)
    };

    res.json(stats);
  } catch (error) {
    console.error('Study stats error:', error);
    res.status(500).json({ message: 'Failed to get study statistics' });
  }
};

// Helper function to calculate study streak
function calculateStudyStreak(tasks) {
  if (tasks.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasTaskOnDate = tasks.some(task => {
      // Check if task has a valid date (createdAt or date field)
      const taskDate = task.createdAt ? new Date(task.createdAt) : new Date(task.date);
      if (isNaN(taskDate.getTime())) {
        return false;
      }
      const taskDateStr = taskDate.toISOString().split('T')[0];
      return taskDateStr === dateStr;
    });
    
    if (hasTaskOnDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// Helper function to get monthly progress
function getMonthlyProgress(tasks) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTasks = tasks.filter(task => {
    // Check if task has a valid date (createdAt or date field)
    const taskDate = task.createdAt ? new Date(task.createdAt) : new Date(task.date);
    if (isNaN(taskDate.getTime())) {
      return false;
    }
    return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
  });
  
  return {
    month: new Date().toLocaleString('default', { month: 'long' }),
    totalTasks: monthlyTasks.length,
    totalHours: monthlyTasks.reduce((sum, task) => sum + parseDuration(task.duration), 0)
  };
}
