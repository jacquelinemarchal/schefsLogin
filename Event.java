// Event.java
// by Jackie Marchal for Schefs

import java.io.*;
import java.lang.*;
import java.util.*;
import java.util.ArrayList;

class Event{

    ArrayList<String> arr = new ArrayList<>(); // arraylist holding events

    public Event(ArrayList<String> arr){
        this.arr = arr;
    }

    public static void main(String args[]) throws FileNotFoundException{

        ArrayList<String> events = new ArrayList<>();
        events.add("eroticismevent1");
        events.add("eroticismevent2");
        events.add("jackie");
        events.add("lola");
        events.add("citizensevent");
        events.add("corona");
        events.add("newevent");
        events.add("performativeevent");
        events.add("aievent");
        events.add("climateevent");

        Event e = new Event(events);

        File template = new File("template.html");
       
        for (int i = 0; i < events.size(); i++) {
            String finalName = events.get(i) + ".html";
            e.writeEventPage(finalName);
        }

    }
    private String writeEventPage(String pageName){
        char[] boilerPlate = new char[1878];

        try {
            InputStreamReader isr = null;
            FileInputStream fis = new FileInputStream("template.html");
            isr = new InputStreamReader(fis);

            OutputStream os = new FileOutputStream(pageName);
            OutputStreamWriter writer = new OutputStreamWriter(os);

            isr.read(boilerPlate, 0, 1878);
            writer.write(boilerPlate, 0, 1878);

            writer.flush();
            isr.close();
        }
        catch(IOException e){
            System.out.println("IO Exception");
            e.printStackTrace();
        }
        System.out.println("Successfully created " + pageName);
        return pageName;
    }
}