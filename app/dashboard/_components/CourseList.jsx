"use client";
import CourseCardItem from "./CourseCardItem";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CourseCountContext } from "@/app/_context/CourseCountContext";
import { useContext } from "react";

function CourseList(){
    const {user}=useUser();
    const [courseList,setCourseList]=useState([]);
    const [loading,setLoading]=useState(false);
    const {totalCourse, setTotalCourse} = useContext(CourseCountContext);
    
    useEffect(()=>{
        user&&GetCourseList();
    },[user])

    const GetCourseList = async() => {
        setLoading(true);
        const result = await axios.post("/api/courses", 
            {createdBy: user?.primaryEmailAddress?.emailAddress});
            
        if (result.data.success) {
            setCourseList(result.data.result);
        } else {
            toast.error(result.data.message || "Failed to fetch courses");
        }
        
        setLoading(false);
        setTotalCourse(result.data.result?.length);
    }
    
    return(
        <div>
            <h2 className="mt-3 font-bold text-2xl flex justify-between items-center">Your Study Material
                <Button variant="outline" 
                onClick={GetCourseList}
                className='border-primary'><RefreshCcw/>Refresh</Button>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5">
                {loading==false? courseList?.map((course,index)=>(
                    <CourseCardItem key={index} course={course}/>
                ))
                :[1,2,3,4,5,6].map((item,index)=>(
                    <div key={index} className="h-56 w-full bg-slate-200 rounded-lg animate-pulse">
                    </div>
                ))
                }
            </div>
        </div>
    )
}

export default CourseList;
