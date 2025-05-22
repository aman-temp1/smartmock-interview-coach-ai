
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [audioQuality, setAudioQuality] = useState("high");

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences Updated",
      description: "Your interview preferences have been saved successfully.",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Interview Preferences</TabsTrigger>
          <TabsTrigger value="account">Account & Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how it appears on your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Current Job Title</Label>
                    <Input
                      id="job-title"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Summary</Label>
                  <Input
                    id="bio"
                    placeholder="Brief description of your background and goals"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This helps customize interview questions to your professional background.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Preferences</CardTitle>
                <CardDescription>
                  Customize your interview experience and default settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-interview-type">Default Interview Type</Label>
                    <Select defaultValue="general">
                      <SelectTrigger id="default-interview-type">
                        <SelectValue placeholder="Select interview type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Interview</SelectItem>
                        <SelectItem value="technical">Technical Interview</SelectItem>
                        <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                        <SelectItem value="hr">HR Interview</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-duration">Default Interview Duration</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="default-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferred-interviewer">Preferred Interviewer</Label>
                  <Select defaultValue="sophia">
                    <SelectTrigger id="preferred-interviewer">
                      <SelectValue placeholder="Select interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alex">Alex (Friendly)</SelectItem>
                      <SelectItem value="sophia">Sophia (Professional)</SelectItem>
                      <SelectItem value="james">James (Technical)</SelectItem>
                      <SelectItem value="olivia">Olivia (HR Specialist)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Difficulty Level</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <div
                        key={level}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          level === "Medium"
                            ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                            : "border-border hover:border-brand-200"
                        }`}
                      >
                        <div className="text-center">
                          <p className="font-medium">{level}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {level === "Easy"
                              ? "Basic questions with guidance"
                              : level === "Medium"
                              ? "Standard interview difficulty"
                              : "Challenging questions and follow-ups"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Audio Settings</CardTitle>
                <CardDescription>
                  Configure microphone and speaker settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="audio-quality">Audio Quality</Label>
                    <Select
                      value={audioQuality}
                      onValueChange={setAudioQuality}
                    >
                      <SelectTrigger id="audio-quality">
                        <SelectValue placeholder="Select audio quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Better for slow connections)</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High (Best quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="noise-reduction">Background Noise Reduction</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="noise-reduction">
                        <SelectValue placeholder="Select noise reduction level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Off</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="test-audio">Test Microphone and Speakers</Label>
                    <p className="text-sm text-muted-foreground">
                      Ensure your audio devices are working correctly
                    </p>
                  </div>
                  <Button variant="outline">Test Audio</Button>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Audio Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your account and interviews
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminders">Interview Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders before scheduled practice sessions
                    </p>
                  </div>
                  <Switch id="reminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive news about new features and offers
                    </p>
                  </div>
                  <Switch id="marketing" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Manage your account security and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="change-password">Change Password</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="change-password"
                      type="password"
                      placeholder="New password"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
